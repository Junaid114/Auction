const express = require('express');
const app = express();
const port = 3000;


let balance = 0;


app.post('/api/deposit', (req, res) => {
    const { amount } = req.body;
    const depositAmount = parseFloat(amount);

    if (!isNaN(depositAmount) && depositAmount > 0) {
        balance += depositAmount;
        res.json({ success: true, message: 'Deposit successful' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid deposit amount' });
    }
});

app.get('/api/balance', (req, res) => {
    res.json({ balance });
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
