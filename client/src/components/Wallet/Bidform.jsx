import React, { useState } from 'react';

const BidForm = () => {
  const [depositedAmount, setDepositedAmount] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const initialAmount = 1000; 
  const requiredDeposit = 0.05 * initialAmount;

  const handleBid = () => {
    if (depositedAmount < requiredDeposit) {
      setShowPopup(true);
    } else {
      
      const randomValue = Math.random(); 
      if (randomValue < 0.5) {
        
        const remainingAmount = depositedAmount - requiredDeposit;
        setDepositedAmount(remainingAmount);
        
        console.log('Congratulations! You won the bid.');
      } else {
       
        const returnAmount = requiredDeposit * 0.05;
        
        console.log('Sorry, you lost the bid.');

        
        fetch('/api/returnToBankAccount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: /*userId*/, amount: returnAmount }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.message); 
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
  };

  const handleDeposit = () => {
    
    const newDepositedAmount = depositedAmount + requiredDeposit;
    setDepositedAmount(newDepositedAmount);
    setShowPopup(false);
    
    console.log('Deposit successful.');
  };

  return (
    <div>
      <h2>Bid Form</h2>
      <p>Deposited Amount: {depositedAmount}</p>
      <p>Initial Amount: {initialAmount}</p>
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />
      <button onClick={handleBid}>Bid</button>

      {showPopup && (
        <div className="popup">
          <p>Please deposit {requiredDeposit} in your wallet.</p>
          <button onClick={handleDeposit}>Deposit Now</button>
        </div>
      )}
    </div>
  );
};

export default BidForm;
