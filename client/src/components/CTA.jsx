import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <>
      {" "}
      
        
        <section className=" ">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Meet the Future of Personal Finance
            </h2>
            <p className="text-sm md:text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              NeoFinance combines smart AI with powerful tools to simplify how
              you budget, invest, and grow—securely and intuitively.
            </p>
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 animate-bounce cursor-pointer"
              >
                Explore the Platform <ArrowRight />
              </Button>
            </Link>
          </div>
        </section>
       
    </>
  );
};

export default CTA;
