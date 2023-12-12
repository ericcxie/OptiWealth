import Aos from "aos";
import "aos/dist/aos.css";
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import Logo from "../../components/ui/logo";
import { auth } from "../../utils/firebase";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const SignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-login-credentials") {
          setErrorMessage(
            "Invalid login credentials. Please check your email and password."
          );
        } else {
          console.log(error);
        }
      });
  };

  const GoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithRedirect(auth, googleProvider);
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          navigate("/dashboard");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [auth, navigate]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  if (loading) {
    return (
      <div
        className="bg-background min-h-screen p-4"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <BounceLoader color="#FFFFFF" />
      </div>
    );
  }

  return (
    <div className="bg-background flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div data-aos="fade-up" data-aos-once className="max-w-sm mx-auto w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
          <div className="w-14">
            <Logo />
          </div>
          <h2 className="font-inter mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign in to OptiWealth
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
              Continue with Google
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
            onSubmit={SignIn}
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
                <div className="text-sm">
                  <Link
                    to="/resetpassword"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
                Sign in
              </button>
            </div>
            {/* Error message for users */}
            {errorMessage && (
              <p className="text-red-600 text-sm">{errorMessage}</p>
            )}
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
