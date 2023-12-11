import Aos from "aos";
import { useEffect } from "react";
import { FaChartBar, FaCloudUploadAlt, FaRocket } from "react-icons/fa";

export default function Details() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <section
      data-aos="fade-up"
      data-aos-once
      className="bg-gradient-to-r from-purple-950 via-background to-blue-950 text-white sectionSize"
    >
      <div>
        <h2 className="mb-4 text-4xl md:text-5xl font-inter font-bold">
          How It Works
        </h2>
      </div>
      <div className="flex flex-col md:flex-row text-sm md:text-lg">
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-white h-12 w-12 flex justify-center items-center mb-3">
            <FaCloudUploadAlt />
          </div>
          <h3 className="font-inter font-medium text-xl mb-2">Upload</h3>
          <p className="text-center font-inter">
            Setup your portfolio by uploading a spreadsheet or screenshot of
            your financial statement
          </p>
        </div>
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-white h-12 w-12 flex justify-center items-center mb-3">
            <FaChartBar />
          </div>
          <h3 className="font-inter font-medium text-xl mb-2">Analyze</h3>
          <p className="text-center font-inter">
            View all your investments in one place and get insights on your
            portfolio performance
          </p>
        </div>
        <div className="flex-1 mx-8 flex flex-col items-center my-4">
          <div className="border-2 rounded-full bg-secondary text-white h-12 w-12 flex justify-center items-center mb-3">
            <FaRocket />
          </div>
          <h3 className="font-inter font-medium text-xl mb-2">Optimize</h3>
          <p className="text-center font-inter">
            Get recommendations on how to rebalance your portfolio based on your
            risk tolerance
          </p>
        </div>
      </div>
    </section>
  );
}
