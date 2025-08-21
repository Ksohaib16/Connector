import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-hot-toast";

import { AuthHeader } from "../components/AuthHeader";
import { AuthForm } from "../components/AuthForm";
import { validateLoginForm } from "../utility/validateForm";
import { setUser } from "../redux/userSlice";
import { config } from "../config/api.config";
import { app } from "../config/Firebase";

const auth = getAuth(app);

const authDetails = {
  heading: "Connector",
  subHeading: "Please confirm your email and password",
};

const inputDetails = [
  { type: "email", placeholder: "Email", name: "email", icon: Mail },
  { type: "password", placeholder: "Password", name: "password", icon: Lock },
];

interface FormErrors {
  [key: string]: string;
}

/* ------------------------------------------------------------------ */
/* Re-usable compact glass card                                       */
/* ------------------------------------------------------------------ */
const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20 p-5 sm:p-6 space-y-4">
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Login page                                                         */
/* ------------------------------------------------------------------ */
export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors({});
  };

  const loginUser = async (email: string) => {
    const token = await auth.currentUser?.getIdToken();
    const { data } = await axios.post(
      `${config.API_URL}/api/v1/auth/login`,
      { email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  };

  const setPresenceOnline = async () => {
    const token = await auth.currentUser?.getIdToken();
    try {
      await axios.post(
        `${config.API_URL}/api/v1/presence`,
        { status: 'ONLINE' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      // non-blocking
      console.warn('Failed to set presence ONLINE');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateLoginForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      toast.error(Object.values(newErrors)[0]);
      return;
    }

    try {
      setIsLoggingIn(true);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const userData = await loginUser(formData.email);
      dispatch(setUser(userData.data.user));
      await setPresenceOnline();
      toast.success("Welcome back!");
      navigate("/home");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <GlassCard>
        <AuthHeader
          heading={authDetails.heading}
          subHeading={authDetails.subHeading}
        />
        <p className="-mt-2 text-sm text-gray-400 text-center">
          Log in to continue your conversations
        </p>

        <AuthForm
          errors={errors}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          values={formData}
          inputDetails={inputDetails}
          button="Log In"
          isLoggin={isLoggingIn}
        />

        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#3874c9] hover:text-[#2e61a6] transition"
          >
            Sign up
          </Link>
        </p>
      </GlassCard>
    </main>
  );
};
