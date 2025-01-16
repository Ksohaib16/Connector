import axios from "axios";
import { User, Mail, Lock } from "lucide-react";
import { AuthHeader } from "../components/AuthHeader";
import { AuthForm } from "../components/AuthForm";
import { AuthWrapper } from "../components/wrapper/AuthWrapper";
import { EmailVerificationModal } from "../components/auth/EmailVerificatinModal";
import { useState, useEffect } from "react";
import { validateForm } from "../utility/validateForm";
import { app } from "../config/Firebase";
import { useDispatch } from "react-redux";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { ContentWrapper } from "../components/wrapper/ContentWrapper";
import { MainWrapper } from "../components/wrapper/MainWrapper";
import { upload } from "../utility/upload";
import { config } from "../config/api.config";

const auth = getAuth(app);

const authDetails = {
  heading: "Connector",
  subHeading: "Please enter your name, email and password",
};

const inputDetails = [
  { type: "text", placeholder: "Name", name: "name", icon: User },
  { type: "text", placeholder: "Email", name: "email", icon: Mail },
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState<Avatar>({
    url: "",
    file: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((currData) => {
      return { ...currData, [e.target.name]: e.target.value };
    });
  };

  useEffect(() => {
    if (!isVerificationSent) return;
    // const intervalId: NodeJS.Timer;

    const checkEmailVerified = async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setIsVerified(true);
          setShowModal(false);

          clearInterval(intervalId);
        }
      }
    };
    const intervalId = window.setInterval(checkEmailVerified, 5000);

    return () => clearInterval(intervalId);
  }, [isVerificationSent]);

  useEffect(() => {
    if (!isVerified) return;
    const createUserDb = async () => {
      try {
        const userData = await createUser(formData.name);
        dispatch(setUser(userData.data.user));
        navigate("/home");
      } catch (err) {
        console.error("error creating user in db", err);
      }
    };
    createUserDb();
  }, [isVerified]);

  const createUser = async (name: string) => {
    const user = auth.currentUser;
    const token = await user?.getIdToken();
    const imageUrl = await upload(avatar.file!);
    console.log(imageUrl);
    console.log("sending data to api", name, token);

    const response = await axios.post(
      `${config.API_URL}/api/v1/auth/signup`,
      {
        avatarUrl: imageUrl,
        username: name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const userData = response.data;
    setFormData({
      name: "",
      email: "",
      password: "",
    });
    return userData;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await sendEmailVerification(userCredential.user);
      setIsVerificationSent(true);
      setShowModal(true);
    }
  };

  return (
    <MainWrapper>
      <ContentWrapper>
        <AuthWrapper>
          <AuthHeader
            heading={authDetails.heading}
            subHeading={authDetails.subHeading}
          />
          <div className="relative mb-[1.5rem] w-full flex items-center justify-between px-2">
            <img
              className="w-16 h-16 rounded-full object-cover"
              src={avatar.url || "/avatar.png"}
              alt=""
            />
            <label
              className="text-[var(--primary)] font-medium underline cursor-pointer"
              htmlFor="avatar"
            >
              Upload Profile
            </label>
            <input
              style={{ display: "none" }}
              type="file"
              id="avatar"
              onChange={(e) => {
                const avtarFile = e.target.files?.[0];
                if (avtarFile) {
                  setAvatar({
                    url: URL.createObjectURL(avtarFile),
                    file: avtarFile,
                  });
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
            button={"SIGN UP"}
          />
          <div className="text-[#AAAAAA]">
            Already have an account?&nbsp;
            <b className="text-[#3874c9]">
              <Link to="/login">Login</Link>
            </b>
          </div>
          {showModal && <EmailVerificationModal email={formData.email} />}
        </AuthWrapper>
      </ContentWrapper>
    </MainWrapper>
  );
};
