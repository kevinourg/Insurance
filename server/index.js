const express = require('express');
const cors = require('cors');
const port = 50700;
const app = express();

// Enable CORS requests as JSON
app.use(cors());
app.use(express.json());

// Persistence

app.post('/send/:value', (req, response) => {
    const value = req.params;
    balance += value;
    response.send('success');
});

app.post('/send/:value', (req, response) => {
    const value = req.params;
    balance -= value;
    response.send('success');
});

app.get('/balance', (req, res) => {
    res.send(balance);
});


// Local Hosting !
app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
