export default function TypingDots() {
  const colors = "#FBC0B6";
  const delays = ["0s", "0.2s", "0.4s", "0.6s"];

  return (
    <div className="flex space-x-2 h-6 items-end">
      {delays.map((delay, index) => (
        <span
          key={index}
          className="w-4 h-4 rounded-full"
          style={{
            backgroundColor: colors,
            animation: `bounce 1s infinite`,
            animationDelay: delay,
          }}
        ></span>
      ))}

      <style jsx>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
