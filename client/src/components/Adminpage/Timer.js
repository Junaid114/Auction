import React, { useState, useEffect } from 'react';

const Timer = ({ initialTime }) => {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        let interval = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            <h2>Timer</h2>
            <p>Time Remaining: {time} seconds</p>
        </div>
    );
};

export default Timer;
