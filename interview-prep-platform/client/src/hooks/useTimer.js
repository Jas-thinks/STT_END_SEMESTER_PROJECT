import { useState, useEffect } from 'react';

const useTimer = (initialTime) => {
    const [time, setTime] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let timer;

        if (isActive && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setIsActive(false);
        }

        return () => clearInterval(timer);
    }, [isActive, time]);

    const startTimer = () => {
        setIsActive(true);
    };

    const stopTimer = () => {
        setIsActive(false);
    };

    const resetTimer = () => {
        setTime(initialTime);
        setIsActive(false);
    };

    return { time, isActive, startTimer, stopTimer, resetTimer };
};

export default useTimer;