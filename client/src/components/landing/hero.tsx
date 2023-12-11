import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <section
      data-aos="fade-up"
      data-aos-once
      className="flex flex-col md:flex-row items-center justify-between bg-secondary px-4 md:px-12 lg:px-48 md:h-screen"
    >
      <div className="text-center md:text-left mt-24 md:mt-0 md:flex-1">
        <h1 className="font-inter text-lg xl:text-xl mb-3 text-gray-200">
          Rebalance your portfolio with
        </h1>
        <h1 className="font-inter font-bold mb-5 text-4xl xl:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600">
          OptiWealth.
        </h1>
        <p className="font-inter text-md xl:text-lg font-medium mb-7 text-gray-200 max-w-md mx-auto md:mx-0">
          <i>
            Optimize your investments. Take control of your wealth. Sign up
            today.
          </i>
        </p>
        <div className="font-inter">
          <Link to="/signup">
            <button className="relative inline-flex items-center justify-center p-4 px-5 py-3 mr-4 overflow-hidden text-indigo-600 font-medium rounded-full shadow-xl transition duration-300 ease-out group hover:ring-1 hover:ring-purple-500">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
              <span className="absolute bottom-0 right-0 w-64 h-64 mb-32 mr-4 bg-indigo-600 rounded-full opacity-30 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 group-hover:rotate-90 ease"></span>
              <span className="relative text-white">Get started</span>
            </button>
          </Link>
          <a href="http://bit.ly/OptiWealthDocs" target="_blank">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm text-gray-900 font-medium rounded-3xl group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
              <span className="relative px-6 py-3 bg-white dark:bg-gray-900 rounded-3xl transition-all ease-in duration-75 group-hover:bg-opacity-0">
                Learn more
              </span>
            </button>
          </a>
        </div>
      </div>
      <div className="mt-8 mb-8 md:mb-0 md:mt-0 md:flex-1 flex items-center justify-center">
        <img
          src="/dist/assets/preview.jpg"
          alt="Application Preview"
          className="rounded-xl transform scale-90 md:scale-125"
        />
      </div>
    </section>
  );
}
