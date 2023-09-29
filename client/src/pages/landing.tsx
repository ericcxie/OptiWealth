import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/ui/logo";

const Landing: React.FC = () => {
  return (
    <div className="bg-background">
      <nav className="fixed flex justify-between py-6 w-full lg:px-48 md:px-12 px-4 content-center bg-background z-10">
        <div className="flex flex-row">
          <div className="mr-4">
            <Logo />
          </div>
          <h1 className="text-inter text-transparent font-bold bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 text-2xl">
            OptiWealth
          </h1>
        </div>

        <div className="font-inter hidden md:block">
          <Link to="/login">
            <button className="mr-6 text-white">Login</button>
          </Link>
          <Link to="/signup">
            <button className="py-2 px-4 text-white bg-lightPurple rounded-3xl">
              Sign Up
            </button>
          </Link>
        </div>
        <div id="showMenu" className="md:hidden">
          <img src="dist/assets/logos/Menu.svg" alt="Menu icon" />
        </div>
      </nav>
      <div
        id="mobileNav"
        className="hidden px-4 py-6 fixed top-0 left-0 h-full w-full bg-secondary z-20 animate-fade-in-down"
      >
        <div id="hideMenu" className="flex justify-end">
          <img src="dist/assets/logos/Cross.svg" alt="" className="h-16 w-16" />
        </div>
      </div>

      {/* Hero */}
      <section className="md:mt-0 md:h-screen flex flex-col justify-center text-center md:text-left md:flex-row md:justify-between md:items-center lg:px-48 md:px-12 px-4 bg-secondary">
        <div className="mt-24 md:mt-0 md:flex-1 md:mr-10">
          <h1 className="font-inter text-3xl font-bold mb-5 text-white">
            Rebalance your{" "}
            <span className="bg-clip-text text-3xl text-transparent bg-gradient-to-r from-blue-700 to-teal-500">
              Portfolio
            </span>{" "}
            with{" "}
            <span className="bg-clip-text text-5xl text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
              OptiWealth.
            </span>
          </h1>
          <p className="font-inter text-lg font-medium mb-7 text-white">
            Optimize your investments. Take control of your financial future.
            Sign up today.
          </p>
          <div className="font-inter">
            <Link to="/signup">
              <button className="bg-gradient-to-r from-purple-900 to-blue-600 px-6 py-3 rounded-3xl border-2 border-background border-solid text-white mr-2 mb-2">
                Get started
              </button>
            </Link>
            <button className="text-white px-6 py-3 border-2 border-white border-solid rounded-3xl">
              Learn more
            </button>
          </div>
        </div>
        <div className="flex justify-around md:block mt-8 md:mt-0 md:flex-1">
          <img src="/dist/assets/MacBook.png" alt="Macbook" />
        </div>
      </section>

      {/* <!-- How it works --> */}
      <section className="bg-gradient-to-r from-purple-950 via-background to-blue-950 text-white sectionSize">
        <div>
          <h2 className="mb-4 text-3xl font-inter font-bold">How It Works</h2>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 mx-8 flex flex-col items-center my-4">
            <div className="border-2 rounded-full bg-secondary text-white h-12 w-12 flex justify-center items-center mb-3">
              1
            </div>
            <h3 className="font-inter font-medium text-xl mb-2">Scan</h3>
            <p className="text-center font-inter">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div className="flex-1 mx-8 flex flex-col items-center my-4">
            <div className="border-2 rounded-full bg-secondary text-white h-12 w-12 flex justify-center items-center mb-3">
              2
            </div>
            <h3 className="font-inter font-medium text-xl mb-2">Modify</h3>
            <p className="text-center font-inter">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div className="flex-1 mx-8 flex flex-col items-center my-4">
            <div className="border-2 rounded-full bg-secondary text-white h-12 w-12 flex justify-center items-center mb-3">
              3
            </div>
            <h3 className="font-inter font-medium text-xl mb-2">Optimize</h3>
            <p className="text-center font-inter">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>
      </section>

      {/* footer */}
      <section>
        <div className="px-14 md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-600">
          {/* Social as */}
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
            <li>
              <a
                href="#0"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="Twitter"
              >
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 11.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H8c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.3-1.1 1.7-1.8z" />
                </svg>
              </a>
            </li>
            <li className="ml-4">
              <a
                href="#0"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="Github"
              >
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                </svg>
              </a>
            </li>
            <li className="ml-4">
              <a
                href="#0"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="Facebook"
              >
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.023 24L14 17h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V14H21l-1 3h-2.72v7h-3.257z" />
                </svg>
              </a>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="text-sm font-inter text-white mr-4">
            &copy; 2023 Eric Xie. | Designed & Built with ☕️
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
