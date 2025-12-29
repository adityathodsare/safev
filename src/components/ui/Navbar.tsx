"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/context/NavigationContext";
import { useRouter } from "next/navigation";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_0.5rem)] left-1/2 transform -translate-x-1/2 pt-2 z-50">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.1] dark:border-white/[0.1] shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-2xl border border-transparent dark:border-white/[0.1] bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg flex space-x-1 px-6 py-4"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
    >
      {children}
    </Link>
  );
};

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { navigateWithLoader } = useNavigation();
  const router = useRouter();

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    navigateWithLoader(router, path);
    setMobileMenuOpen(false);
    setActive(null);
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Desktop/Tablet Navbar */}
      <div
        className={cn(
          "hidden md:flex fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "py-2 bg-black/95 backdrop-blur-md shadow-xl"
            : "py-4 bg-black",
          className
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Team Name on the left */}
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Team NexaGen - SAFEV
            </span>
          </div>

          {/* Menu items on the right */}
          <Menu setActive={setActive}>
            <div onClick={() => handleNavigation("/")}>
              <MenuItem
                setActive={setActive}
                active={active}
                item={"Home"}
              ></MenuItem>
            </div>
            <MenuItem setActive={setActive} active={active} item={"About Us"}>
              <div className="grid grid-cols-1 gap-2 p-2 text-sm">
                <div onClick={() => handleNavigation("/prototype")}>
                  <HoveredLink href="/prototype">Prototype</HoveredLink>
                </div>
                <div onClick={() => handleNavigation("/aboutus/aboutteam")}>
                  <HoveredLink href="/aboutus/aboutteam">
                    About Team
                  </HoveredLink>
                </div>
                <div onClick={() => handleNavigation("/tracking")}>
                  <HoveredLink href="/tracking">Track Data</HoveredLink>
                </div>
              </div>
            </MenuItem>
            <div onClick={() => handleNavigation("/buy")}>
              <MenuItem
                setActive={setActive}
                active={active}
                item={"Buy Now"}
              ></MenuItem>
            </div>
            <div onClick={() => handleNavigation("/contact")}>
              <MenuItem
                setActive={setActive}
                active={active}
                item={"Contact Us"}
              ></MenuItem>
            </div>
            <div
              onClick={() => handleNavigation("/logout")}
              className="bg-red-600 hover:bg-red-700 transition-colors rounded-lg p-1 text-white"
            >
              <MenuItem
                setActive={setActive}
                active={active}
                item={"Logout"}
              ></MenuItem>
            </div>
          </Menu>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div
        className={cn(
          "md:hidden fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-black",
          scrolled ? "py-2 shadow-xl" : "py-3"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Team NexaGen - SAFEV
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-white hover:bg-gray-800 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pb-4 bg-black rounded-lg shadow-lg border border-gray-800"
            >
              <div className="flex flex-col space-y-2 p-4">
                <div
                  onClick={() => handleNavigation("/")}
                  className="px-4 py-3 rounded-lg text-white hover:bg-gray-800 cursor-pointer transition-colors font-medium"
                >
                  Home
                </div>

                <div className="px-4 py-3 rounded-lg text-white">
                  <div className="font-medium mb-2 text-lg">About Us</div>
                  <div className="grid grid-cols-1 gap-2 pl-4">
                    <div
                      onClick={() => handleNavigation("/prototype")}
                      className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      Prototype
                    </div>
                    <div
                      onClick={() => handleNavigation("/aboutus/aboutteam")}
                      className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      About Team
                    </div>

                    <div
                      onClick={() => handleNavigation("/tracking")}
                      className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      Track Data
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => handleNavigation("/buy")}
                  className="px-4 py-3 rounded-lg text-white hover:bg-gray-800 cursor-pointer transition-colors font-medium"
                >
                  Buy Now
                </div>

                <div
                  onClick={() => handleNavigation("/register")}
                  className="px-4 py-3 rounded-lg text-white hover:bg-gray-800 cursor-pointer transition-colors font-medium"
                >
                  Contact Us
                </div>

                <div
                  onClick={() => handleNavigation("/logout")}
                  className="px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer transition-colors font-medium text-center"
                >
                  register
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add padding to content to account for fixed navbar */}
      <div
        className={cn(
          "transition-all duration-300 bg-black",
          isMobile ? "h-16" : scrolled ? "h-16" : "h-20"
        )}
      ></div>
    </>
  );
}

export default Navbar;
