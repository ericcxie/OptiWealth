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
            <button className="relative inline-flex items-center justify-center p-4 px-5 py-2 overflow-hidden font-medium text-indigo-600 rounded-3xl shadow-2xl group">
              <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-indigo-700 rounded-full blur-md ease"></span>
              <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
                <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-purple-700 rounded-full blur-md"></span>
                <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-blue-700 rounded-full blur-md"></span>
              </span>
              <span className="relative text-white font-semibold">Sign Up</span>
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
