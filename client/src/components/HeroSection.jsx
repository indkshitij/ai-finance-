import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import Banner from "../assets/image.jpg";
import { ArrowRight } from "lucide-react";

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
        <h1 className="text-6xl md:text-7xl lg:text-8xl pb-6 gradient-title tracking-tight font-extrabold font-inter">
          Unlock Your Financial <br />
          Future with AI
        </h1>
        <p className="text-md text-gray-600 mb-8 max-w-2xl mx-auto">
          Manage your finances effortlessly with AI. Track spending, income, and
          budget in real time, with instant transaction entry through bill
          scanning and personalized insights.
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <Link to="/dashboard">
          <Button
            size="lg"
            className="px-8 cursor-pointer hover:scale-[1.02] bg-blue-500 hover:bg-blue-600 duration-300 ease-in-out"
          >
            Get Started <ArrowRight />
          </Button>
        </Link>
        <a href="#testimonials">
          <Button
            size="lg"
            variant="outline"
            className="px-8 cursor-pointer hover:scale-[1.02] text-gray-800 duration-300 ease-in-out"
          >
            See Testimonial
          </Button>
        </a>
      </div>

      <div className="hero-image-wrapper mt-5 md:mt-0">
        <div ref={imageRef} className="hero-image">
          <img
            src={Banner}
            alt="Dashboard Preview"
            className="rounded-lg shadow-2xl border mx-auto w-auto md:h-[70vh] lg:h-[80vh] xl:h-[90vh]"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
