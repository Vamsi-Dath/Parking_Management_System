const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pms-password',
    database: 'pms'
});

app.get('/api/parking-spots', (req, res) => {
    db.query('SELECT * FROM ParkingSlot', (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
