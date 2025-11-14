import { useState, useEffect } from 'react';

const useTimer = (initialTime) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time <= 0) return;
    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [time]);

  return [time, setTime];
};

export default useTimer;
