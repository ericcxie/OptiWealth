import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { Link } from "react-router-dom";

import Logo from "../../components/ui/logo";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="bg-background flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="max-w-sm mx-auto w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
          <Logo />
          <h2 className="font-inter mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Reset Password
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordReset();
            }}
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
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset Password
              </button>
            </div>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-white">{message}</p>
          )}
          {error && (
            <p className="mt-4 text-center text-sm text-red-600">{error}</p>
          )}

          <p className="mt-5 text-center text-sm text-gray-500">
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
