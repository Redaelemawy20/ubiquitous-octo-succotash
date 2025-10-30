interface AppLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AppLogo({ className = "", size = "md" }: AppLogoProps) {
  const sizeClasses = {
    sm: "h-[37px] w-[119px]", // height 37px width 119px
    md: "h-[100px] w-[100px]", // height 100px width 100px
    lg: "lg:h-[104px] lg:w-[340px]", // height 104px width 340px
  };

  return (
    <img
      src="/imgs/logo.png"
      alt="easygenerator logo"
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
}
