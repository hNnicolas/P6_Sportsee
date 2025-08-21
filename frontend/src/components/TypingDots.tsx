import React from "react";

interface TypingDotsProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TypingDots: React.FC<TypingDotsProps> = ({
  color = "#ff6b9d",
  size = "md",
  className = "",
}) => {
  const delays: string[] = ["-0.32s", "-0.16s", "0s", "0.16s"];

  const sizeClasses = {
    sm: "w-3 h-3 space-x-2 h-8",
    md: "w-4 h-4 space-x-3 h-12",
    lg: "w-5 h-5 space-x-4 h-16",
  };

  const translateY = {
    sm: "-8px",
    md: "-12px",
    lg: "-16px",
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes bounce-typing-dots {
            0%, 80%, 100% {
              transform: scale(0.8) translateY(0);
              opacity: 0.7;
            }
            40% {
              transform: scale(1.2) translateY(${translateY[size]});
              opacity: 1;
            }
          }
          
          .typing-dot {
            animation: bounce-typing-dots 1.4s ease-in-out infinite both;
          }
        `,
        }}
      />

      <div
        className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}
      >
        {delays.map((delay: string, index: number) => (
          <span
            key={index}
            className={`typing-dot ${sizeClasses[size].split(" ")[0]} ${
              sizeClasses[size].split(" ")[1]
            } rounded-full shadow-lg`}
            style={{
              backgroundColor: color,
              animationDelay: delay,
              boxShadow: `0 4px 8px ${color}30`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default TypingDots;
