"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/context/NavigationContext";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

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
        className="cursor-pointer text-theme hover:opacity-90 font-medium px-3 py-2 rounded-lg hover:bg-theme-muted transition-colors"
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
                className="glass-card overflow-hidden shadow-xl"
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
      className="relative rounded-2xl glass-card shadow-lg flex items-center space-x-1 px-6 py-4"
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
        <h4 className="text-xl font-bold mb-1 text-theme">
          {title}
        </h4>
        <p className="text-theme-secondary text-sm max-w-[10rem]">
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
      className="text-theme-secondary hover:text-theme px-4 py-2 rounded-lg hover:bg-theme-muted transition-colors block"
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

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    navigateWithLoader(router, path);
    setMobileMenuOpen(false);
    setActive(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navBg = scrolled
    ? "py-2 bg-theme/95 backdrop-blur-md shadow-xl border-b border-theme"
    : "py-4 bg-theme border-b border-transparent";

  const linkClass =
    "px-4 py-3 rounded-lg text-theme hover:bg-theme-muted cursor-pointer transition-colors font-medium";

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={cn(
          "hidden md:flex fixed top-0 inset-x-0 z-50 transition-all duration-300",
          navBg,
          className,
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              SAFE-V
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Menu setActive={setActive}>
              <div onClick={() => handleNavigation("/")}>
                <MenuItem setActive={setActive} active={active} item={"Home"} />
              </div>
              <MenuItem setActive={setActive} active={active} item={"About Us"}>
                <div className="grid grid-cols-1 gap-2 p-2 text-sm">
                  <div onClick={() => handleNavigation("/prototype")}>
                    <HoveredLink href="/prototype">Prototype</HoveredLink>
                  </div>
                  <div onClick={() => handleNavigation("/tracking")}>
                    <HoveredLink href="/tracking">Track Data</HoveredLink>
                  </div>
                </div>
              </MenuItem>
              <div onClick={() => handleNavigation("/buy")}>
                <MenuItem setActive={setActive} active={active} item={"Buy Now"} />
              </div>
              <div onClick={() => handleNavigation("/contact")}>
                <MenuItem setActive={setActive} active={active} item={"Contact Us"} />
              </div>
              <div
                onClick={() => handleNavigation("/register")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors rounded-lg px-1 text-white"
              >
                <MenuItem setActive={setActive} active={active} item={"Register"} />
              </div>
            </Menu>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div
        className={cn(
          "md:hidden fixed top-0 inset-x-0 z-50 transition-all duration-300",
          navBg,
          scrolled ? "py-2" : "py-3",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              SAFEV
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-theme hover:bg-theme-muted focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pb-4 glass-card shadow-lg"
            >
              <div className="flex flex-col space-y-2 p-4">
                <div onClick={() => handleNavigation("/")} className={linkClass}>
                  Home
                </div>
                <div className="px-4 py-3 rounded-lg">
                  <div className="font-medium mb-2 text-lg text-theme">
                    About Us
                  </div>
                  <div className="grid grid-cols-1 gap-2 pl-4">
                    <div onClick={() => handleNavigation("/prototype")} className={linkClass}>
                      Prototype
                    </div>
                    <div onClick={() => handleNavigation("/tracking")} className={linkClass}>
                      Track Data
                    </div>
                  </div>
                </div>
                <div onClick={() => handleNavigation("/buy")} className={linkClass}>
                  Buy Now
                </div>
                <div onClick={() => handleNavigation("/contact")} className={linkClass}>
                  Contact Us
                </div>
                <div
                  onClick={() => handleNavigation("/register")}
                  className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 cursor-pointer transition-colors font-medium text-center"
                >
                  Register
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300",
          isMobile ? "h-16" : scrolled ? "h-16" : "h-20",
        )}
      />
    </>
  );
}

export default Navbar;
