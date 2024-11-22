const express = require('express');
const mysql = require('mysql2'); // Ensure this is 'mysql2'

const app = express();
const port = 3000;

app.use(express.json());

// Set up the MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'pms-password',
    database: 'pms'
});

// Route to fetch parking spots
app.get('/api/parking-spots', (req, res) => {
    db.execute('SELECT * FROM ParkingSlot', [], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: err });
        }
        res.json(results); // Send the results as JSON
    });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
