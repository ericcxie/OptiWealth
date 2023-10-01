import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  AuthErrorCodes,
} from "firebase/auth";
import Logo from "../../components/ui/logo";
import { auth } from "../../utils/firebase";
import { Link, useNavigate } from "react-router-dom";

const Registration: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Sign in with google
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
      console.log("User signed up with Google");
      navigate("/setup");
    } catch (error) {
      console.log(error);
    }
  };

  const SignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //  password check
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Clear error message
    setErrorMessage("");

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(
          "Account successfully created for user:",
          userCredential.user.email
        );
        console.log(userCredential);
        navigate("/setup");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorMessage("Email is already in use by another account.");
            break;
          case "auth/invalid-email":
            setErrorMessage("Email address is not valid.");
            break;
          case "auth/operation-not-allowed":
            setErrorMessage("Email/password accounts are not enabled.");
            break;
          case "auth/weak-password":
            setErrorMessage("Password is too weak.");
            break;
          default:
            setErrorMessage(
              "An unknown error occurred. Please try again later."
            );
        }
        console.error("Error signing up with password and email:", error);
      });
  };

  return (
    <div className="bg-background flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="max-w-sm mx-auto w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
          <Logo />
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign up for OptiWealth
          </h2>
        </div>
        <button
          onClick={GoogleLogin}
          className="w-full group h-12 mt-5 mb-2 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-lightPurple focus:bg-[#212834] active:bg-[#212834]"
        >
          <div className="relative flex items-center space-x-4 justify-center">
            <img
              src="https://tailus.io/sources/blocks/social/preview/images/google.svg"
              className="absolute left-0 w-5"
              alt="google logo"
            />
            <span className="block w-max font-semibold tracking-wide text-white text-sm transition duration-300 group-hover:text-lightPurple sm:text-base">
              Sign up with Google
            </span>
          </div>
        </button>
        <div className="my-3 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 text-center text-inter font-semibold dark:text-neutral-200">
            or
          </p>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={SignUp}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="pl-2 block w-full rounded-md border-0 py-1.5 bg-[#212834] text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="pl-2 block w-full rounded-md border-0 py-1.5 bg-[#212834] text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Confirm password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="pl-2 block w-full rounded-md border-0 py-1.5 bg-[#212834] text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create account
              </button>
            </div>

            {/* Error message for users */}
            {errorMessage && (
              <p className="text-red-600 text-sm">{errorMessage}</p>
            )}
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
