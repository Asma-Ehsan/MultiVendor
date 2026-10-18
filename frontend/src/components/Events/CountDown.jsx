import React, { useEffect, useState } from "react";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });
  
  function calculateTimeLeft() {
    const difference = +new Date(data.Finish_Date) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  // short names shown under each number
  const labels = {
    days: "Days",
    hours: "Hours",
    miniutes: "Mins",
    seconds: "Secs",
  };

  const timerComponents = Object.keys(timeLeft).map((interval, index) => {
    return (
      <React.Fragment key={interval}>
        {index > 0 ? <span className="font-bold text-outline">:</span> : null}
        <div className="bg-surface-container-lowest px-3 py-2 rounded-xl shadow-sm border border-surface-container/60 min-w-[52px] hover:border-primary-fixed hover:shadow-md transition-all duration-200">
          <span className="text-headline-sm text-primary font-bold block leading-none">
            {String(timeLeft[interval]).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-secondary uppercase font-semibold">
            {labels[interval]}
          </span>
        </div>
      </React.Fragment>
    );
  });
  return (
    <div className="font-jakarta">
      {timerComponents.length ? (
        <div className="flex items-center gap-2 text-center">
          {timerComponents}
        </div>
      ) : (
        <span className="text-error text-headline-sm font-bold">Time's up</span>
      )}
    </div>
  );
};
export default CountDown;
