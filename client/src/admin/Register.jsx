import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";
import { showToast } from "../utils/toastNotifications";
import "./Login.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userTypeConfirmed, setUserTypeConfirmed] = useState(false);
  const { register } = useAuth(); // Use register instead of createUser
  const navigate = useNavigate();
  const { setShowSplash } = useSplash();

  useEffect(() => {
    setShowSplash(false);
  }, [setShowSplash]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userTypeConfirmed) {
      showToast("Please confirm you are registering as a User.", "warning");
      return;
    }

    try {
      await register(username, email, password, "User"); // Call register instead of createUser
      navigate("/"); // Redirect to home or desired route after registration
    } catch (error) {
      console.error("Registration failed:", error);
      showToast("Registration failed. Please check your details and try again.", "error");
    }
  };

  return (
    <div className="container w-[400px]">
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-gray-700 text-[0.9rem]">Welcome</h1>
        <p className="text-gray-900 text-2xl font-normal mb-10">Create an Account</p>
        <form className="form w-full" onSubmit={handleSubmit}>
          <div className="input-field relative">
            <div className="input-field">
              <input
                required
                autoComplete="off"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
              />
              <label htmlFor="username">Username</label>
            </div>
          </div>
          <div className="input-field relative">
            <div className="input-field">
              <input
                required
                autoComplete="off"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
              />
              <label htmlFor="email">Email</label>
            </div>
          </div>
          <div className="input-field relative">
            <div className="input-field">
              <input
                required
                autoComplete="off"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
              />
              <button
                type="button"
                className="passicon"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="text-gray-500" />
                ) : (
                  <AiFillEye className="text-gray-500" />
                )}
              </button>
              <label htmlFor="password">Password</label>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="userTypeConfirm"
              checked={userTypeConfirmed}
              onChange={() => setUserTypeConfirmed(!userTypeConfirmed)}
              className="mr-2 w-4 h-4"
            />
            <label htmlFor="userTypeConfirm" className="text-gray-700">
              I confirm I am registering as a User
            </label>
          </div>

          <button
            type="submit"
            className="bg-black text-white text-[0.8rem] p-2 rounded-lg mb-4"
          >
            Register
          </button>
          <div className="flex items-center justify-center space-x-6">
            <Link to="/" className="text-blue-500 hover:underline text-[0.9rem]">
              Already have an account? Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
