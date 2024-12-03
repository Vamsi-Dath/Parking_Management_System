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
        setFilteredSlots(ownerDetails);
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
              <li key={slot.SlotID || `${slot.VehicleRegNo}-no-slot`}>
                {slot.SlotID && slot.ZoneCode ? (
                  <>
                    Zone {slot.ZoneCode} - Slot {slot.SlotID} - Vehicle:{" "}
                    {slot.VehicleRegNo}
                  </>
                ) : (
                  <>Vehicle {slot.VehicleRegNo} is not occupying a slot.</>
                )}
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
