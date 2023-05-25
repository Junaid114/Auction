import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepositManagement = () => {
  const [deposits, setDeposits] = useState([]);
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');

  // Function to handle user deposit
  const handleDeposit = async () => {
    try {
      const response = await axios.post('/api/deposits', { userId, amount }); // Replace with your actual API endpoint
      const newDeposit = response.data;
      setDeposits([...deposits, newDeposit]);
      setUserId('');
      setAmount('');
    } catch (error) {
      console.error('Error depositing:', error);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const response = await axios.get('/api/deposits'); // Replace with your actual API endpoint
      const depositData = response.data;
      setDeposits(depositData);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    }
  };

  return (
    <div>
      <h2>Deposit Management</h2>

      {/* Deposit Form */}
      <h3>Deposit Form</h3>
      <label htmlFor="userId">User ID:</label>
      <input
        type="text"
        id="userId"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <label htmlFor="amount">Amount:</label>
      <input
        type="text"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>

      {/* Deposit Listing Component */}
      <h3>Deposit List</h3>
      {deposits.length > 0 ? (
        <ul>
          {deposits.map((deposit) => (
            <li key={deposit.id}>
              User ID: {deposit.userId}, Amount: {deposit.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No deposits yet.</p>
      )}
    </div>
  );
};

export default DepositManagement;
