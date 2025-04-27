import React from "react";
import { Card, CardContent } from "./ui/card";
const testimonialsData = [
  {
    name: "Aarti Sharma",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/40.jpg",
    quote:
      "Welth has completely revolutionized the way I manage my business finances. The AI insights have helped me identify areas to save money and improve cash flow.",
  },
  {
    name: "Ravi Patel",
    role: "Freelancer",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    quote:
      "The receipt scanning feature has been a game changer for me. It saves hours of manual work every month, letting me focus on my clients and projects.",
  },
  {
    name: "Priya Deshmukh",
    role: "Financial Advisor",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    quote:
      "I highly recommend Welth to my clients. Its multi-currency support and detailed analytics make it the ideal tool for anyone managing international finances.",
  },
];


const Testimonial = () => {
  return (
    <section id="testimonials" className="py-10 sm:py-20 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-zinc-800 mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {testimonialsData.map((testimonial, index) => (
            <Card
              key={index}
              className=" py-1 lg:p-4 hover:shadow-xl hover:scale-[1.02]  ease-in transition-shadow duration-300 bg-white rounded-xl"
            >
              <CardContent className="pt-4 pb-2">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <div className="font-semibold text-zinc-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  “{testimonial.quote}”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
