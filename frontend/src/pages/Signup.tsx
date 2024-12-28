import axios from "axios";
import { User, Mail, Lock } from "lucide-react";
import { AuthHeader } from "../components/AuthHeader";
import { AuthForm } from "../components/AuthForm";
import { AuthWrapper } from "../components/wrapper/AuthWrapper";
import { EmailVerificationModal } from "../components/auth/EmailVerificatinModal";
import { useState, useEffect } from "react";
import { validateForm } from "../utility/validateForm";
import { app } from "../config/Firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const auth = getAuth(app);

const authDetails = {
  heading: "Sign in to Connector",
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

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((currData) => {
      return { ...currData, [e.target.name]: e.target.value };
    });
  };

  useEffect(() => {
    if (!isVerificationSent) return;
    let intervalId: number;

    const checkEmailVerified = async () => {
      console.log("verification check");
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          console.log("Email verified!");
          setShowModal(false);
          setIsVerified(true);
          clearInterval(intervalId);
        }
      }
    };

    intervalId = window.setInterval(checkEmailVerified, 5000);

    return () => clearInterval(intervalId);
  }, [isVerificationSent]);

  useEffect(() => {
    if (!isVerified) return;
    const createUserDb = async () => {
      try {
        const userData = await createUser(formData.name);
        console.log(userData);
      } catch (err) {
        console.error("error creating user in db", err);
      }
    };
    createUserDb();
  }, [isVerified]);

  const createUser = async (name: string) => {
    const user = auth.currentUser;
    const token = await user?.getIdToken();

    console.log("sending data to api", name, token);

    const response = await axios.post(
      "http://localhost:3000/api/v1/auth/signup",
      {
        username: name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("create req sent to db");
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
      console.log("user created in firebase");
      await sendEmailVerification(userCredential.user);
      console.log("verification email sent");
      setIsVerificationSent(true);
      setShowModal(true);
    }
  };

  return (
    <AuthWrapper>
      <AuthHeader
        heading={authDetails.heading}
        subHeading={authDetails.subHeading}
      />
      <AuthForm
        errors={errors}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        values={formData}
        inputDetails={inputDetails}
        button={"SIGN UP"}
      />
      <div className="text-[#AAAAAA]">
        Already have an account? <b className="text-[#3874c9]">LOGIN</b>
      </div>
      {showModal && <EmailVerificationModal email={formData.email} />}
    </AuthWrapper>
  );
};
