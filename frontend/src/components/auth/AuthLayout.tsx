import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AppLogo } from "../common/AppLogo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  maxWidth?: string;
}

const quotes = [
  "Learning is most powerful when it's created by the people who live it every day.",
  "Empowering employees to share knowledge turns a company into a continuous learning community.",
];

export function AuthLayout({
  children,
  title,
  subtitle,
  maxWidth,
}: AuthLayoutProps) {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row">
      {/* Left Section - Login Form */}
      <div className="h-screen w-full lg:w-8/12 py-4 bg-background flex flex-col gap-4 items-center px-8 lg:px-16 xl:px-24 relative">
        {/* Header */}
        <div className="relative block top-0  lg:-left-8 w-full">
          <AppLogo size="md" />
        </div>

        {/* Main Content */}
        <div className="w-full max-w-lg mx-auto px-4">
          <h1
            className={`text-2xl font-bold mb-8 text-center ${maxWidth} mx-auto`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground text-center mb-8">{subtitle}</p>
          )}
          {children}
        </div>
      </div>

      {/* Right Section - Sea Image */}
      <div className="h-screen flex flex-col lg:w-1/2 bg-linear-to-br from-secondary to-background relative overflow-hidden border-primary border-l-2 rounded-l-[3rem]">
        {/* Sea Image */}
        <div className="flex-1 flex items-center justify-center relative">
          <img
            src="/imgs/alex-sea.avif"
            alt="alex sea"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Quotes Section - Middle */}
        <div className="absolute inset-0 flex items-center justify-center px-8 lg:px-16 pointer-events-none">
          {/* Subtle gradient overlay for natural contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent"></div>

          <div className="relative flex flex-col items-center max-w-2xl w-full z-10">
            <div className="relative overflow-hidden min-h-fit w-full">
              {quotes.map((quote, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center transition-all duration-500 ease-in-out ${
                    index === currentQuoteIndex
                      ? "translate-x-0 opacity-100 relative"
                      : index < currentQuoteIndex
                      ? "-translate-x-full opacity-0 absolute inset-0"
                      : "translate-x-full opacity-0 absolute inset-0"
                  }`}
                >
                  <p className="text-lg md:text-2xl font-secondary text-center text-primary-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] leading-relaxed">
                    "{quote}"
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 self-start pointer-events-auto">
              <AppLogo size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
