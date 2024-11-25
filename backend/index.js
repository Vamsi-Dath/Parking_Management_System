import express from "express";
import mysql from "mysql2";
import cors from "cors";
const app = express();
const port = 9000;
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pms-password",
  database: "pms",
});

app.get("/api/getZones", (_, res) => {
  db.query("SELECT DISTINCT ZoneCode FROM ParkingSlot", (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    res.json(result);
  });
});

app.get("/api/parking-spots", (_, res) => {
  db.query("SELECT * FROM ParkingSlot", (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    res.json(result);
  });
});

app.post("/api/book-slot", (req, res) => {
  const {
    VehicleRegNo,
    ownerID,
    firstName,
    lastName,
    year,
    brand,
    slotID,
    slotType,
    phoneNumber,
    additionalNumber,
  } = req.body;
  const insertOwnerQuery =
    "INSERT INTO Owner (OwnerID, first_name, last_name) VALUES (?, ?, ?)";
  const insertVehicleQuery =
    "INSERT INTO Vehicle (VehicleRegNo, OwnerID, Brand, YearOfManufacture, VehicleType) VALUES (?, ?, ?, ?, ?)";
  const updateParkingSlotQuery =
    "UPDATE ParkingSlot SET VehicleRegNo = ? WHERE SlotID = ?";
  const insertOwnerPhoneDirectoryQuery =
    "INSERT INTO OwnerPhoneDirectory (OwnerID, PhoneNumber) VALUES (?, ?)";

  function commitTransaction() {
    return new Promise((resolve, reject) => {
      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            reject(err);
          });
        }
        resolve();
      });
    });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    db.query(
      "SELECT * FROM Owner WHERE OwnerID = ?",
      [ownerID],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.log(err);
            res.sendStatus(500);
          });
        }

        if (result.length > 0) {
          return db.rollback(() => {
            console.log("Owner already exists");
            res.status(400);
          });
        }
      }
    );

    db.query(
      "SELECT * FROM Vehicle WHERE VehicleRegNo = ?",
      [VehicleRegNo],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.log(err);
            res.sendStatus(500);
          });
        }

        if (result.length > 0) {
          return db.rollback(() => {
            console.log("Vehicle already exists");
            res.status(400);
          });
        }
      }
    );

    db.query(insertOwnerQuery, [ownerID, firstName, lastName], (err) => {
      if (err) {
        return db.rollback(() => {
          console.log(err);
          res.sendStatus(500);
        });
      }

      db.query(
        insertVehicleQuery,
        [VehicleRegNo, ownerID, brand, year, slotType],
        (err) => {
          if (err) {
            return db.rollback(() => {
              console.log(err);
              res.sendStatus(500);
            });
          }

          db.query(updateParkingSlotQuery, [VehicleRegNo, slotID], (err) => {
            if (err) {
              return db.rollback(() => {
                console.log(err);
                res.sendStatus(500);
              });
            }

            db.query(
              insertOwnerPhoneDirectoryQuery,
              [ownerID, phoneNumber],
              (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.log(err);
                    res.sendStatus(500);
                  });
                }

                if (additionalNumber !== "") {
                  db.query(
                    insertOwnerPhoneDirectoryQuery,
                    [ownerID, additionalNumber],
                    (err) => {
                      if (err) {
                        return db.rollback(() => {
                          console.log(err);
                          res.sendStatus(500);
                        });
                      }

                      commitTransaction()
                        .then(() => {
                          console.log("Transaction committed");
                          res.sendStatus(200);
                        })
                        .catch((err) => {
                          console.log(err);
                          res.sendStatus(500);
                        });
                    }
                  );
                } else {
                  commitTransaction()
                    .then(() => {
                      console.log("Transaction committed");
                      res.sendStatus(200);
                    })
                    .catch((err) => {
                      console.log(err);
                      res.sendStatus(500);
                    });
                }
              }
            );
          });
        }
      );
    });
    console.log("Transaction started");
  });
});

app.get("/api/parking-zones", (_, res) => {
  db.query("SELECT * FROM ParkingZone", (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    res.json(result);
  });
});

app.get("/api/owners", (_, res) => {
  db.query("SELECT * FROM Owner", (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    res.json(result);
  });
});

app.get("/api/owner-phone-directory", (_, res) => {
  db.query("SELECT * FROM OwnerPhoneDirectory", (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    res.json(result);
  });
});

app.get("/api/incharges", (_, res) => {
  db.query("SELECT * FROM Incharge", (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    res.json(result);
  });
});

app.get("/api/incharge-phone-directory", (_, res) => {
  db.query("SELECT * FROM InchargePhoneDirectory", (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    res.json(result);
  });
});

app.get("/api/vehicles", (_, res) => {
  db.query("SELECT * FROM Vehicle", (err, result) => {
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
  console.log(
    `Access Parking Slots at http://localhost:${port}/api/parking-spots`
  );
  console.log(
    `Access Parking Zones at http://localhost:${port}/api/parking-zones`
  );
  console.log(`Access Owners at http://localhost:${port}/api/owners`);
  console.log(
    `Access Owner Phone Directory at http://localhost:${port}/api/owner-phone-directory`
  );
  console.log(`Access Incharges at http://localhost:${port}/api/incharges`);
  console.log(
    `Access Incharge Phone Directory at http://localhost:${port}/api/incharge-phone-directory`
  );
  console.log(`Access Vehicles at http://localhost:${port}/api/vehicles`);
});
