import { useEffect } from "react";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

export default function Hero() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <section
      data-aos="fade-up"
      data-aos-once
      className="md:mt-0 md:h-screen flex flex-col justify-center text-center md:text-left md:flex-row md:justify-between md:items-center lg:px-48 md:px-12 px-4 bg-secondary"
    >
      <div className="mt-24 md:mt-0 md:flex-1 md:mr-10">
        <h1 className="font-inter text-2xl font-semibold mb-3 text-gray-200">
          Rebalance your portfolio with
        </h1>
        <h1 className="font-inter font-bold mb-5 bg-clip-text text-5xl text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
          OptiWealth.
        </h1>
        <p className="font-inter text-lg px-10 md:px-0 font-medium mb-7 text-gray-200 max-w-md">
          <i>
            Optimize your investments. Take control of your wealth. Sign up
            today.
          </i>
        </p>
        <div className="font-inter">
          <Link to="/signup">
            <button className="transition duration-300 ease-in-out bg-gradient-to-br from-purple-700 to-blue-600 hover:bg-gradient-to-bl px-6 py-3 rounded-3xl border-2 border-background border-solid text-white mr-2 mb-2 hover:shadow-lg">
              Get started
            </button>
          </Link>
          <a href="http://bit.ly/OptiWealthDocs" target="_blank">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-3xl group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
              <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-3xl group-hover:bg-opacity-0">
                Learn more
              </span>
            </button>
          </a>
        </div>
      </div>
      <div className="flex justify-around md:block mt-8 md:mt-0 md:flex-1">
        <img
          src="/dist/assets/preview.jpg"
          alt="Macbook"
          className="rounded-lg transform scale-125"
        />
      </div>
    </section>
  );
}
