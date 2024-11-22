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

app.get('/api/parking-zones', (req, res) => {
    db.query('SELECT * FROM ParkingZone', (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.json(result);
    });
});
app.get('/api/owners', (req, res) => {
    db.query('SELECT * FROM Owner', (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.json(result);
    });
});

app.get('/api/owner-phone-directory', (req, res) => {
    db.query('SELECT * FROM OwnerPhoneDirectory', (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.json(result);
    });
});

app.get('/api/incharges', (req, res) => {
    db.query('SELECT * FROM Incharge', (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.json(result);
    });
});

app.get('/api/incharge-phone-directory', (req, res) => {
    db.query('SELECT * FROM InchargePhoneDirectory', (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        res.json(result);
    });
});

app.get('/api/vehicles', (req, res) => {
    db.query('SELECT * FROM Vehicle', (err, result) => {
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
    console.log('Access Parking Slots at http://localhost:3000/api/parking-spots');
    console.log('Access Parking Zones at http://localhost:3000/api/parking-zones');
    console.log('Access Owners at http://localhost:3000/api/owners');
    console.log('Access Owner Phone Directory at http://localhost:3000/api/owner-phone-directory');
    console.log('Access Incharges at http://localhost:3000/api/incharges');
    console.log('Access Incharge Phone Directory at http://localhost:3000/api/incharge-phone-directory');
    console.log('Access Vehicles at http://localhost:3000/api/vehicles');
});
