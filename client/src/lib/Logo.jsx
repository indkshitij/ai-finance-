import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <div className="flex items-end  group transition-all duration-300 ease-in-out">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-poetsen text-blue-500 gradient-title transform group-hover:-translate-y-1 transition-all duration-300">
          N
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 group-hover:text-gray-950 transition-colors duration-300">
          eoFinance
        </p>
      </div>
    </Link>
  );
};

export default Logo;
