import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="md:mt-0 md:h-screen flex flex-col justify-center text-center md:text-left md:flex-row md:justify-between md:items-center lg:px-48 md:px-12 px-4 bg-secondary">
      <div className="mt-24 md:mt-0 md:flex-1 md:mr-10">
        <h1 className="font-inter text-2xl font-semibold mb-3 text-gray-200">
          Rebalance your portfolio with
        </h1>
        <h1 className="font-inter font-bold mb-5 bg-clip-text text-5xl text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
          OptiWealth.
        </h1>
        <p className="font-inter text-lg px-10 md:px-0 font-medium mb-7 text-gray-200 max-w-md">
          🚀{" "}
          <i>
            Optimize your investments. Take control of your wealth. Sign up
            today.
          </i>
        </p>
        <div className="font-inter">
          <Link to="/signup">
            <button className="transition duration-300 ease-in-out bg-gradient-to-r from-purple-900 to-blue-600 px-6 py-3 rounded-3xl border-2 border-background border-solid text-white mr-2 mb-2 hover:brightness-90 hover:shadow-lg">
              Get started
            </button>
          </Link>
          <button className="transition duration-300 ease-in-out text-white px-6 py-3 border-2 border-white border-solid rounded-3xl hover:bg-white hover:text-black hover:shadow-lg">
            <a
              href="https://github.com/ericcxie/OptiWealth"
              className="transition duration-100 ease-in-out hover:text-black"
            >
              Learn more
            </a>
          </button>
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
