import React, { useState, useEffect } from 'react';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  useEffect(() => {
    fetch('/api/balance')
      .then((response) => response.json())
      .then((data) => {
        setBalance(data.balance);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setBalance((prevBalance) => prevBalance + amount);
            setDepositAmount(0);
            console.log(data.message);
          } else {
            console.error(data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <div>
      <h2>Wallet</h2>
      <p>Balance: ${balance.toFixed(2)}</p>
      <input
        type="number"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
};

export default Wallet;
