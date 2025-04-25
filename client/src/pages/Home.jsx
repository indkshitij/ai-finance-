import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "../components/HeroSection";
import StatsSection from "@/components/StatsSection";
import CTA from "@/components/CTA";
import Features from "@/components/Features";
import HowItWork from "@/components/HowItWork";
import Testimonial from "@/components/Testimonial";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden ">
      <Header />
      <div className="px-4 sm:px-6">
        <HeroSection />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 bg-blue-50">
        <StatsSection />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40">
        <Features />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 bg-blue-50">
        <HowItWork />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40">
        <Testimonial />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 bg-blue-500">
        <CTA />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
