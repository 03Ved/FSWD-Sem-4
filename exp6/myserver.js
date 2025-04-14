const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Middleware to parse JSON request body

const logger = (req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
};
app.use(logger);

// User data
let users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
];

// Routes
// CREATE a new user
app.post('/users', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    const newUser = { id: users.length + 1, name };
    users.push(newUser);
    res.status(201).json(newUser);
});

// READ all users
app.get('/users', (req, res) => {
    res.json(users);
});

// READ a single user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
});

// UPDATE a user by ID
app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    user.name = name;
    res.json(user);
});

// DELETE a user by ID
app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }
    users.splice(userIndex, 1);
    res.json({ message: "User deleted successfully" });
});

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});