// import axios from "axios";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import {app} from "../config/Firebase";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
      
      setUsername(value);
    }
  };

  const handleSignup = async () => {
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    sendEmailVerification(user)


    console.log(user)
  };

  return (
    <div className="flex flex-col justify-center w-64 h-64 bg-gray-700">
      <input
        className="mb-4 h-8"
        type="text"
        placeholder="username"
        name="username"
        value={username}
        onChange={handleChange}
      />
      <input
        className="mb-4 h-8"
        type="text"
        placeholder="email"
        name="email"
        value={email}
        onChange={handleChange}
      />
      <input
        className="mb-4 h-8"
        type="text"
        placeholder="password"
        name="password"
        value={password}
        onChange={handleChange}
      />
      <button className="text-white" onClick={() =>{handleSignup()}}>
        Signup
      </button>
    </div>
  );
};
