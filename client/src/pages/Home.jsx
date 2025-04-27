import React, { Suspense, lazy } from "react";
import { BarLoader } from "react-spinners";
import background from "../assets/CtaBG.jpg";

const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));
const HeroSection = lazy(() => import("../components/HeroSection"));
const StatsSection = lazy(() => import("@/components/StatsSection"));
const CTA = lazy(() => import("@/components/CTA"));
const Features = lazy(() => import("@/components/Features"));
const HowItWork = lazy(() => import("@/components/HowItWork"));
const Testimonial = lazy(() => import("@/components/Testimonial"));

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden ">
      <Header />
      <div className="px-4 sm:px-6">
        <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
          <HeroSection />
        </Suspense>
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 bg-blue-50">
        <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
          <StatsSection />
        </Suspense>
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40">
        <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
          <Features />
        </Suspense>
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 bg-blue-50">
        <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
          <HowItWork />
        </Suspense>
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40">
        <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
          <Testimonial />
        </Suspense>
      </div>
      <div className="relative overflow-hidden">
        <div className="relative z-20 flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 bg-blue-500/50 min-h-[50vh]">
          <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
            <CTA />
          </Suspense>
        </div>

        <section className="absolute inset-0 -z-10">
          <img
            src={background}
            className="w-full h-full object-cover object-center"
            alt="Background"
          />
        </section>
      </div>

      <Suspense fallback={<BarLoader width={"100%"} color="#3b82f6" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;
