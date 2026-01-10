import { useEffect, useState } from "react"

export default function Flashes({ message }) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setIsHidden(false);
  }, [message])

  if (!message) return null;

  return (
    <div className={`flashes ${isHidden ? "hidden" : ""}`}>
      <TimerLine setHidden={setIsHidden} />
      <p>{message}</p>
    </div>
  );
}

function TimerLine({ setHidden }) {
  const [lineWidth, setLineWidth] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineWidth(w => {
        if (w <= 0) {
          clearInterval(interval);
          setHidden(true);
          return 0;
        }
        return w - 0.2;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [setHidden]);

  return (
    <div
      className="timer-line"
      style={{ width: `${lineWidth}%` }}
    />
  );
}