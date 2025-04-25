import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Banner from "../assets/banner.jpeg";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (imageElement) {
        if (scrollPosition > scrollThreshold) {
          imageElement.classList.add("scrolled");
        } else {
          imageElement.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto text-center">
        <h1 className="text-6xl md:text-7xl lg:text-8xl pb-6 gradient-title tracking-tighter font-extrabold font-inter">
          Manage Your Finances <br />
          with Intelligence
        </h1>
        <p className="text-md text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <Link to="/dashboard">
          <Button
            size="lg"
            className="px-8 cursor-pointer hover:scale-105 duration-300 ease-in-out"
          >
            Get Started
          </Button>
        </Link>
        <Link to="#">
          <Button
            size="lg"
            variant="outline"
            className="px-8 cursor-pointer hover:scale-105 duration-300 ease-in-out"
          >
            Watch Demo
          </Button>
        </Link>
      </div>

      <div className="hero-image-wrapper mt-5 md:mt-0">
        <div ref={imageRef} className="hero-image">
          <img
            src={Banner}
            width={1080}
            height={720}
            alt="Dashboard Preview"
            className="rounded-lg shadow-2xl border mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
