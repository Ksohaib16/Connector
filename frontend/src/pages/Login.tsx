import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { AuthHeader } from "../components/AuthHeader";
import { AuthForm } from "../components/AuthForm";
import { AuthWrapper } from "../components/wrapper/AuthWrapper";
import { useState, useEffect } from "react";
import { validateLoginForm, validateFormPassword } from "../utility/validateForm";
import { app } from "../config/Firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth(app);

const authDetails = {
  heading: "Login to Connector",
  subHeading: "Please confirm you email and password",
};

const inputDetails = [
  { type: "text", placeholder: "Email", name: "email", icon: Mail },
  { type: "password", placeholder: "Password", name: "password", icon: Lock },
];

interface FormErrors {
  [key: string]: string;
}

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((currData) => {
      return { ...currData, [e.target.name]: e.target.value };
    });
    setErrors({})
  };

  const loginUser = async (email: string) => {
    const user = auth.currentUser;
    const token = await user?.getIdToken();

    console.log("sending data to api",token);

    const response = await axios.post(
      "http://localhost:3000/api/v1/auth/login",{
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const userData = response.data;
    setFormData({
      email: "",
      password: "",
    });
    return userData;
  };


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateLoginForm(formData);
    console.log("newError", newErrors)
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
  
        const userData = await loginUser(formData.email);
        if (!userData) {
          return;
        }
        console.log(userData, userData.status)
      } catch {
        setErrors(prev => ({
          ...prev,
          password: "Invalid email or password"
        }));
      }
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
        Don't have an account? <b className="text-[#3874c9]">SIGNUP</b>
      </div>
    </AuthWrapper>
  );
};
