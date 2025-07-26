import React, { useState, useEffect } from 'react';

const LiveDate = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const dateOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const formattedDate = currentDate.toLocaleDateString(undefined, dateOptions);

  return <>{formattedDate}</>;
};

export default LiveDate;