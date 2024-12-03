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

// API to vacate a parking sot
app.post("/api/vacate-slot", (req, res) => {
  console.log(req.body);
  const { vehicleRegNo, slotID } = req.body;
  console.log("vehicle num is:", vehicleRegNo);

  const deleteVehicleQuery = "DELETE FROM Vehicle WHERE VehicleRegNo = ?";
  const updateParkingSlotQuery =
    "UPDATE ParkingSlot SET VehicleRegNo = NULL WHERE SlotID = ?";

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

    // updates the vehicle registration to null in the ParkingSlot table for the given slot ID
    db.query(updateParkingSlotQuery, [slotID], (err) => {
      if (err) {
        return db.rollback(() => {
          console.log(err);
          res.sendStatus(500);
        });
      }

      // Deletes the vehicle from the Vehicle table
      db.query(deleteVehicleQuery, [vehicleRegNo], (err) => {
        if (err) {
          return db.rollback(() => {
            console.log(err);
            res.sendStatus(500);
          });
        }

        commitTransaction()
          .then(() => {
            console.log("Transaction committed");
            res
              .status(200)
              .json({ message: "Slot vacated successfully", success: true });
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(500);
          });
      });
    });
  });
});

app.get("/api/get-owner-details", (req, res) => {
  const { firstName, lastName } = req.query;
  if (!firstName || !lastName) {
    return res.status(400).send("First name and last name are required.");
  }
  const getAllOwnersQuery = `SELECT Owner.first_name, Owner.last_name,
  OwnerPhoneDirectory.PhoneNumber,
  Vehicle.VehicleRegNo,
  ParkingSlot.SlotID,
  ParkingSlot.ZoneCode
  FROM Owner
  JOIN OwnerPhoneDirectory ON Owner.OwnerID = OwnerPhoneDirectory.OwnerID
  LEFT JOIN Vehicle ON Vehicle.OwnerID = Owner.OwnerID
  LEFT JOIN ParkingSlot ON Vehicle.VehicleRegNo = ParkingSlot.VehicleRegNo
  WHERE LOWER(Owner.first_name) = LOWER(?) AND LOWER(Owner.last_name) = LOWER(?)
`;

  db.query(getAllOwnersQuery, [firstName, lastName], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database query failed.");
    }
    if (result.length === 0) {
      return res.status(404).send("No owner details found.");
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
  console.log(
    `Access Owner Details at http://localhost:${port}/api/get-owner-details`
  );
});
