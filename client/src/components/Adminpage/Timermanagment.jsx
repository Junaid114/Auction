import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from './Timer';

const TimerContainer = () => {
  const [initialTime, setInitialTime] = useState(0);

  useEffect(() => {
    fetchInitialTime();
  }, []);

  const fetchInitialTime = async () => {
    try {
      const response = await axios.get('/api/initial-time');
      setInitialTime(response.data.initialTime);
    } catch (error) {
      console.error('Error fetching initial time:', error);
    }
  };

  return (
    <div>
      <h1>Timer App</h1>
      {initialTime > 0 ? (
        <Timer initialTime={initialTime} />
      ) : (
        <p>Loading initial time...</p>
      )}
    </div>
  );
};

export default TimerContainer;
