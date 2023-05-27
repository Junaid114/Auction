const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();

const connectionString = 'mongodb://localhost:27017';

const dbName = 'your_database_name';

const collectionName = 'bankAccounts';

async function getUserBankAccount(userId) {
  try {
    const client = await MongoClient.connect(connectionString);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const userBankAccount = await collection.findOne({ userId });
    client.close();
    return userBankAccount;
  } catch (error) {
    throw new Error('Failed to get user bank account.');
  }
}

// Function to update a user's bank account balance
async function updateUserBankAccountBalance(userId, newBalance) {
  try {
    const client = await MongoClient.connect(connectionString);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.updateOne({ userId }, { $set: { balance: newBalance } });
    client.close();
  } catch (error) {
    throw new Error('Failed to update user bank account balance.');
  }
}

// API endpoint for returning amount to bank account
app.post('/api/returnToBankAccount', (req, res) => {
  const { userId, amount } = req.body;

  // Retrieve the user's bank account details based on the userId
  getUserBankAccount(userId)
    .then((userBankAccount) => {
      if (!userBankAccount) {
        return res
          .status(404)
          .json({ success: false, message: 'User bank account not found.' });
      }

      // Perform the necessary logic to return the amount to the user's bank account
      // In this example, we'll simply update the user's bank account balance

      // Calculate the new balance
      const newBalance = userBankAccount.balance + amount;

      // Update the user's bank account balance
      updateUserBankAccountBalance(userId, newBalance)
        .then(() => {
          res.json({
            success: true,
            message: 'Amount returned to bank account successfully.',
          });
        })
        .catch(() => {
          res.status(500).json({
            success: false,
            message: 'Failed to return amount to bank account.',
          });
        });
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user bank account.',
      });
    });
});
