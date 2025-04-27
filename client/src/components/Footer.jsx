import Logo from "@/lib/Logo";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  GithubIcon,
  Instagram,
  Linkedin,
  LinkedinIcon,
  User,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t min-h-[10vh] flex justify-center items-center px-3 md:px-10 lg:px-20 bg-gray-200/80 ">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo Section */}
        <div>
          <Logo />
        </div>

        {/* Creator Section */}
        <div className="text-center md:text-right text-sm text-gray-700">
          Crafted with 💙 by{" "}
          <HoverCard>
            <HoverCardTrigger className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline cursor-pointer transition-all">
              Kshitij
            </HoverCardTrigger>
            <HoverCardContent className="w-60 p-4 rounded-md border bg-white shadow-md">
              <div className="flex flex-col gap-2">
                {[
                  {
                    icon: (
                      <Instagram className="w-4 h-4 group-hover:text-white" />
                    ),
                    label: "Instagram",
                    href: "#",
                    hover: "group-hover:bg-pink-500",
                  },
                  {
                    icon: <User className="w-4 h-4 group-hover:text-white" />,
                    label: "Portfolio",
                    href: "#",

                    hover: "group-hover:bg-orange-500 ",
                  },
                  {
                    icon: (
                      <GithubIcon className="w-4 h-4 group-hover:text-white" />
                    ),
                    label: "GitHub",
                    href: "#",
                    hover: "group-hover:bg-zinc-800 ",
                  },
                  {
                    icon: (
                      <Linkedin className="w-4 h-4 group-hover:text-white" />
                    ),

                    label: "LinkedIn",
                    href: "#",
                    hover: "group-hover:bg-blue-600",
                  },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="group flex items-center gap-2 px-2 py-2 rounded-md hover:bg-blue-50 transition-colors text-gray-800"
                  >
                    <div
                      className={`bg-gray-200 p-2 rounded-full ${item.hover}`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </a>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
