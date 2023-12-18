import Aos from "aos";
import { useEffect } from "react";
import { FaUserShield } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { FaChartPie } from "react-icons/fa";
import { MdManageHistory } from "react-icons/md";

export default function FeaturesBlocks() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <section data-aos="fade-up" data-aos-once className="relative">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div
        className="absolute inset-0 top-1/2 md:mt-24 lg:mt-0 bg-gray-900 pointer-events-none"
        aria-hidden="true"
      ></div>
      <div className="hidden md:inline absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20 text-white text-4xl md:text-5xl font-inter">
            <h2 className="h2 mb-4 font-bold">Explore the Features</h2>
            <p className="text-base md:text-xl font-inter text-gray-600 italic">
              A modern investment management platform designed to assist users
              in optimizing their portfolio allocations.
            </p>
          </div>

          {/* Items */}
          <div className="max-w-xs mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none font-inter text-sm md:text-base leading-snug">
            {/* 1st item */}
            <div className="relative flex flex-col items-center p-6 bg-gray-800 rounded-2xl shadow-xl">
              <div className="flex justify-center items-center bg-indigo-700 rounded-full h-14 w-14 mb-2">
                <MdManageHistory className="text-white" size={25} />
              </div>
              <h4 className="text-xl text-white font-bold leading-snug tracking-tight mb-1">
                Manage
              </h4>
              <p className="text-gray-400 text-center">
                OptiWealth ensures seamless management of your investments by
                tracking and organizing your portfolio in one place.
              </p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 bg-gray-800 rounded-2xl shadow-xl">
              <div className="flex justify-center items-center bg-indigo-700 rounded-full h-14 w-14 mb-2">
                <FaChartPie className="text-white" size={22} />
              </div>
              <h4 className="text-xl text-white font-bold leading-snug tracking-tight mb-1">
                Rebalance
              </h4>
              <p className="text-gray-400 text-center">
                Leverage OptiWealth's intelligent algorithm to rebalance your
                assets and maximize your returns while minimizing risks.
              </p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 bg-gray-800 rounded-2xl shadow-xl">
              <div className="flex justify-center items-center bg-indigo-700 rounded-full h-14 w-14 mb-2">
                <FaUserShield className="text-white" size={20} />
              </div>
              <h4 className="text-xl text-white font-bold leading-snug tracking-tight mb-1">
                Peace of mind
              </h4>
              <p className="text-gray-400 text-center">
                Rest assured that your data is safe with us. OptiWealth uses AES
                256-bit encryption to protect your data so you can focus on what
                matters most.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
