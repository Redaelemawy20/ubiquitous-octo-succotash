import type { ReactNode } from "react";
import { AppLogo } from "../common/AppLogo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  maxWidth?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  maxWidth,
}: AuthLayoutProps) {
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
      <div className="h-screen flex lg:w-1/2 bg-linear-to-br from-secondary to-background relative overflow-hidden border-primary border-l-2 rounded-l-[3rem]">
        {/* Header */}

        {/* Sea Image */}
        <div className="flex-1 flex items-center justify-center relative">
          <img
            src="/imgs/alex-sea.avif"
            alt="alex sea"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logo Section */}
        <div className="absolute left-[8%] bottom-6 lg:left-16 text-foreground">
          {/* Logo */}
          <div className="mb-4 ">
            <AppLogo size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
