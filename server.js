const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load user credentials and codes from JSON files
let users = require('./users.json');
let codes = require('./codes.json');

// Routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if credentials match admin
    if (username === users.admin.username && password === users.admin.password) {
        res.redirect('/admin.html');
    } else if (username === users.user.username && password === users.user.password) {
        res.redirect('/page1.html');
    } else {
        res.send('Invalid credentials');
    }
});

app.get('/codes', (req, res) => {
    res.json(codes);
});

app.post('/add-code', (req, res) => {
    const { code, description } = req.body;
    codes.push({ code, description });
    fs.writeFileSync('./codes.json', JSON.stringify(codes, null, 2));
    res.send('Code added successfully');
});

app.post('/edit-code', (req, res) => {
    const { oldCode, newCode, newDescription } = req.body;
    const codeIndex = codes.findIndex(c => c.code === oldCode);
    if (codeIndex !== -1) {
        codes[codeIndex] = { code: newCode, description: newDescription };
        fs.writeFileSync('./codes.json', JSON.stringify(codes, null, 2));
        res.send('Code edited successfully');
    } else {
        res.status(404).send('Code not found');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
