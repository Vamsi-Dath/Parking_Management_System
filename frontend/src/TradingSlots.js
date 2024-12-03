import React, { useEffect, useState } from "react";
import "./TradeParkingSlots.css";

function TradeParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({
    slot1: null,
    slot2: null,
  });

  // slot data from api
  useEffect(() => {
    fetch("http://localhost:9000/api/parking-spots")
      .then((response) => response.json())
      .then((data) => {
        // only show occupied slots
        const occupiedSlots = data.filter((slot) => slot.VehicleRegNo !== null);
        setSlots(occupiedSlots);
      })
      .catch((error) => {
        console.error("Error fetching parking slots:", error);
      });
  }, []);

  const handleSlotSelect = (slot, slotNumber) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [slotNumber]: slot,
    }));
  };

  // Handle slot trade
  const handleTrade = () => {
    if (selectedSlots.slot1 && selectedSlots.slot2) {
      const updatedSlots = slots.map((slot) => {
        if (slot.SlotID === selectedSlots.slot1.SlotID) {
          return { ...slot, VehicleRegNo: selectedSlots.slot2.VehicleRegNo };
        }
        if (slot.SlotID === selectedSlots.slot2.SlotID) {
          return { ...slot, VehicleRegNo: selectedSlots.slot1.VehicleRegNo };
        }
        return slot;
      });

      setSlots(updatedSlots);
      setSelectedSlots({ slot1: null, slot2: null });
    } else {
      alert("Please select two slots to trade.");
    }
  };

  return (
    <div className="trade-parking-slots">
      <h3>Trade Parking Slots</h3>

      <div>
        <h4>Occupied Slots</h4>
        <div className="slot-container">
          {slots.map((slot) => (
            <div
              key={slot.SlotID}
              onClick={() =>
                handleSlotSelect(slot, selectedSlots.slot1 ? "slot2" : "slot1")
              }
              className={`slot ${
                selectedSlots.slot1?.SlotID === slot.SlotID ||
                selectedSlots.slot2?.SlotID === slot.SlotID
                  ? "selected"
                  : ""
              }`}
            >
              Zone {slot.ZoneCode} - Slot {slot.SlotID} (Vehicle:{" "}
              {slot.VehicleRegNo})
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4>Selected Slots for Trade</h4>
        <p>
          {selectedSlots.slot1
            ? `Slot 1: Zone ${selectedSlots.slot1.ZoneCode} - Slot ${selectedSlots.slot1.SlotID}`
            : "Select Slot 1"}
        </p>
        <p>
          {selectedSlots.slot2
            ? `Slot 2: Zone ${selectedSlots.slot2.ZoneCode} - Slot ${selectedSlots.slot2.SlotID}`
            : "Select Slot 2"}
        </p>
        <button onClick={handleTrade}>Trade Slots</button>
      </div>

      <div>
        <h4>Updated Slot Assignments</h4>
        <div className="slot-container">
          {slots.map((slot) => (
            <div key={slot.SlotID} className="slot">
              Zone {slot.ZoneCode} - Slot {slot.SlotID}{" "}
              {slot.VehicleRegNo ? ` - Occupied by ${slot.VehicleRegNo}` : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TradeParkingSlots;