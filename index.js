const express = require('express');
const connectDB = require('./config/db');

// Connect to Mongo
connectDB();

const app = express();

// Init Middleware
app.use(express.json({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));

// Router middleware
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
