import React, { useState } from "react";
import "./OwnerFilter.css";

function OwnerFilter() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [filteredSlots, setFilteredSlots] = useState([]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      alert("Please enter both first name and last name.");
      return;
    }

    fetch(
      `http://localhost:9000/api/get-owner-details?firstName=${encodeURIComponent(
        firstName
      )}&lastName=${encodeURIComponent(lastName)}`
    )
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Error fetching owner details.");
        }
        return response.json();
      })
      .then((ownerDetails) => {
        console.log("Fetched owner details:", ownerDetails);
        const uniqueSlots = ownerDetails.filter(
          (slot, index, self) =>
            index ===
            self.findIndex(
              (s) =>
                s.VehicleRegNo === slot.VehicleRegNo &&
                s.SlotID === slot.SlotID &&
                s.ZoneCode === slot.ZoneCode
            )
        );

        setFilteredSlots(uniqueSlots);
      })
      .catch((error) => {
        console.error("Error fetching owner details:", error);
        alert(error.message);
      });
  };
  return (
    <div className="owner-filter">
      <h3>Look up Owner Details</h3>
      <form onSubmit={handleFilterSubmit}>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter First Name"
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Last Name"
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {filteredSlots.length > 0 ? (
        <div>
          <h4>
            Information on {firstName} {lastName}
          </h4>
          <ul>
            {filteredSlots.map((slot) => (
              <li
                key={slot.SlotID || `${slot.VehicleRegNo}-no-slot`}
                className="slot-item"
              >
                <span className="slot-left">
                  {slot.SlotID && slot.ZoneCode
                    ? `Zone ${slot.ZoneCode}: Slot ${slot.SlotID}`
                    : "No slot being occupied"}
                </span>
                <span className="slot-right">
                  {slot.VehicleRegNo} {slot.VehicleType} {slot.Brand}{" "}
                  {slot.YearOfManufacture}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>
          {firstName && lastName
            ? `Click Submit to view details for ${firstName} ${lastName}.`
            : "Enter name to view your current info."}
        </p>
      )}
    </div>
  );
}

export default OwnerFilter;
