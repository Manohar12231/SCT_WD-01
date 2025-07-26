import React, { useState, useEffect } from 'react';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return <>{time.toLocaleTimeString()}</>;
};

export default LiveClock;