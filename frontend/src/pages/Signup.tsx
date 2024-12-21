import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../config/Firebase";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
    else if (name === "username") setUsername(value);
  };

  const handleSignup = async () => {
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    setUser(user);
    await sendEmailVerification(user);
    console.log("User created in Firebase:", user);
    console.log("Verification email sent");
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) {
        setIsEmailVerified(true);
        console.log("Email verified");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const createUserInDbIfNeeded = async () => {
      if (user && isEmailVerified && username) {
        const token = await user.getIdToken();
        console.log("Token:", token);
        try {
          const response = await axios.post(
            "http://localhost:3000/api/v1/auth/signup",
            { id: user.uid, username },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("User create req sent to DB:", response.data);
        } catch (error) {
          console.error(
            "Error creating user in DB:",
            (error as AxiosError).response?.data || (error as Error).message
          );
        }
      }
    };
    createUserInDbIfNeeded();
  }, [isEmailVerified]);

  const handleLogin = async () => {
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const token = await user.getIdToken();

    await axios.post(
      "http://localhost:3000/api/v1/auth/login",
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  useEffect(() => {
    if (user && !isEmailVerified) {
      const checkVerification = setInterval(async () => {
        await user.reload();
        console.log("Checking");
        setIsEmailVerified(user.emailVerified);
        console.log(user.emailVerified);
      }, 5000);

      return () => clearInterval(checkVerification);
    }
  }, [user, isEmailVerified]);

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
      <button
        className="text-white"
        onClick={() => {
          handleSignup();
        }}
      >
        Signup
      </button>
      <br /><br />
      <button
        className="text-white"
        onClick={() => {
          handleLogin();
        }}
      >
        signin
      </button>
    </div>
  );
};
