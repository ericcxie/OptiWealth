import React from "react";

import Navbar from "../components/landing/navbar";
import Hero from "../components/landing/hero";
import Details from "../components/landing/details";
import FeaturesBlocks from "../components/landing/features";
import Footer from "../components/landing/footer";

const Landing: React.FC = () => {
  return (
    <div className="bg-background">
      <Navbar />
      <Hero />
      <Details />
      <FeaturesBlocks />
      <Footer />
    </div>
  );
};

export default Landing;
