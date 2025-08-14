export default function TypingDots() {
  const delays = ["0s", "0.2s", "0.4s", "0.6s"];

  return (
    <div className="flex items-center space-x-2">
      {delays.map((delay, index) => (
        <span
          key={index}
          className="w-3 h-3 bg-blue-500 rounded-full"
          style={{
            animationName: "blink",
            animationDuration: "1s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: delay,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
