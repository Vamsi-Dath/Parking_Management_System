import React, { useState } from "react";

function TradeParkingSlots() {
  const [slots, setSlots] = useState([
    { SlotID: "SLOT101", ZoneCode: "A8", VehicleRegNo: "UT1234" },
    { SlotID: "SLOT102", ZoneCode: "D1", VehicleRegNo: "FL3456" },
    { SlotID: "SLOT103", ZoneCode: "C2", VehicleRegNo: "WA5678" },
    { SlotID: "SLOT104", ZoneCode: "B2", VehicleRegNo: "AZ3456" },
  ]);

  const [selectedSlots, setSelectedSlots] = useState({
    slot1: null,
    slot2: null,
  });

  // Handle slot selection
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
        <h4>Booked Slots</h4>
        <ul>
          {slots.map((slot) => (
            <li
              key={slot.SlotID}
              onClick={() =>
                handleSlotSelect(slot, selectedSlots.slot1 ? "slot2" : "slot1")
              }
              className={`slot ${
                slot.VehicleRegNo ? "booked" : "available"
              } ${selectedSlots.slot1?.SlotID === slot.SlotID ||
                selectedSlots.slot2?.SlotID === slot.SlotID
                ? "selected"
                : ""}`}
            >
              Zone {slot.ZoneCode} {/* Only display Zone Code */}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4>Selected Slots for Trade</h4>
        <p>
          {selectedSlots.slot1
            ? `Slot 1: Zone ${selectedSlots.slot1.ZoneCode}`
            : "Select Slot 1"}
        </p>
        <p>
          {selectedSlots.slot2
            ? `Slot 2: Zone ${selectedSlots.slot2.ZoneCode}`
            : "Select Slot 2"}
        </p>
        <button onClick={handleTrade}>Trade Slots</button>
      </div>

      <div>
        <h4>Updated Slot Assignments</h4>
        <ul>
          {slots.map((slot) => (
            <li key={slot.SlotID}>
              Zone {slot.ZoneCode} {/* Only display Zone Code */}
              {slot.VehicleRegNo ? ` - Occupied by ${slot.VehicleRegNo}` : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TradeParkingSlots;
