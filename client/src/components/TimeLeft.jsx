// import React from "react";

// const TimeLeft = (props) => {
//   return (
//     <div className="">
//       <h6>{props.time}</h6>
//     </div>
//   );
// };

// export default TimeLeft;

import React, { useEffect, useState } from 'react';

const TimeLeft = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentTime = new Date().getTime();
      const remainingTime = Math.max(0, endTime - currentTime);

      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return <span>{timeLeft}</span>;
};

export default TimeLeft;
