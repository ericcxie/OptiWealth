import { Link } from "react-router-dom";
import Logo from "../ui/logo";

export default function Navbar() {
  return (
    <div>
      <nav className="fixed flex justify-between py-6 w-full lg:px-48 md:px-12 px-4 content-center bg-background z-10">
        <Link to="/">
          <div className="flex flex-row">
            <div className="mr-2 mt-0.5 w-7">
              <Logo />
            </div>
            <h1 className="text-inter text-transparent font-bold bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 text-2xl">
              OptiWealth
            </h1>
          </div>
        </Link>

        <div className="font-inter hidden md:block">
          <Link to="/login">
            <button className="mr-6 text-white font-semibold transition duration-300 ease-in-out hover:text-gray-300">
              Log in
            </button>
          </Link>
          <Link to="/signup">
            <button className="py-2 px-4 text-white font-semibold bg-indigo-600 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-3xl">
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
    </div>
  );
}
