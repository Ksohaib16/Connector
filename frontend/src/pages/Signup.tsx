import axios from "axios";
import { User, Mail, Lock, Camera } from "lucide-react";
import { useState, useEffect, FC } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { toast } from "react-hot-toast";

import { AuthHeader } from "../components/AuthHeader";
import { AuthForm } from "../components/AuthForm";
import { EmailVerificationModal } from "../components/auth/EmailVerificatinModal";
import { validateForm } from "../utility/validateForm";
import { upload } from "../utility/upload";
import { setUser } from "../redux/userSlice";
import { app } from "../config/Firebase";
import { config } from "../config/api.config";

/* ------------------------------------------------------------------ */
/* Re-usable compact glass card                                       */
/* ------------------------------------------------------------------ */
const GlassCard: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20 p-5 sm:p-6 space-y-4">
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Signup page                                                        */
/* ------------------------------------------------------------------ */
const auth = getAuth(app);

const authDetails = {
  heading: "Connector",
  subHeading: "Please enter your name, email and password",
};

const inputDetails = [
  { type: "text", placeholder: "Name", name: "name", icon: User },
  { type: "email", placeholder: "Email", name: "email", icon: Mail },
  { type: "password", placeholder: "Password", name: "password", icon: Lock },
];

interface FormErrors {
  [key: string]: string;
}
interface Avatar {
  url: string;
  file: File | null;
}

export const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [avatar, setAvatar] = useState<Avatar>({ url: "", file: null });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ----------------------- email verification polling --------------- */
  useEffect(() => {
    if (!isVerificationSent) return;
    const id = window.setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;
      await user.reload();
      if (user.emailVerified) {
        setIsVerified(true);
        setShowModal(false);
        clearInterval(id);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [isVerificationSent]);

  /* ----------------------- create user in DB after verification ----- */
  useEffect(() => {
    if (!isVerified) return;
    (async () => {
      try {
        const token = await auth.currentUser!.getIdToken();
        const imageUrl = avatar.file ? await upload(avatar.file) : "";
        const { data } = await axios.post(
          `${config.API_URL}/api/v1/auth/signup`,
          { avatarUrl: imageUrl, username: formData.name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(setUser(data.user));
        navigate("/home");
      } catch {
        toast.error("Could not finalise signup");
      }
    })();
  }, [isVerified, avatar, formData.name, dispatch, navigate]);

  /* ----------------------- handlers --------------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error(Object.values(newErrors)[0]);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await sendEmailVerification(cred.user);
      setIsVerificationSent(true);
      setShowModal(true);
      toast.success("Verification email sent – check your inbox!");
    } catch {
      toast.error("Signup failed – please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <GlassCard>
        <AuthHeader
          heading={authDetails.heading}
          subHeading={authDetails.subHeading}
        />

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={avatar.url || "/avatar.png"}
              alt="avatar preview"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white/20"
            />
            <label
              htmlFor="avatar"
              className="absolute -bottom-1 -right-1 bg-[#3874c9] text-white rounded-full p-1 cursor-pointer hover:bg-[#2e61a6] transition"
            >
              <Camera size={14} />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">Profile Picture</p>
            <p className="text-xs text-gray-400">PNG / JPG up to 2 MB</p>
          </div>
          <input
            id="avatar"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAvatar({ url: URL.createObjectURL(file), file });
                toast.success("Image selected");
              }
            }}
          />
        </div>

        <AuthForm
          errors={errors}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          values={formData}
          inputDetails={inputDetails}
          button="Sign Up"
        />

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#3874c9] hover:text-[#2e61a6] transition"
          >
            Log in
          </Link>
        </p>

        {showModal && <EmailVerificationModal email={formData.email} />}
      </GlassCard>
    </main>
  );
};
