import React from 'react';
import { useEffect, useState } from 'react';
import './SlotForm.css';

const SlotForm = ({ handleSubmit, selectedSlot, selectedZone, closeModal }) => {
  const [VehicleRegNo, setVehicleRegNo] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [zones, setZones] = useState([]);
  const [error, setError] = useState(null);
  const [selectedZoneValue, setSelectedZoneValue] = useState(selectedZone);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch('/api/getZones')
    .then((res) => res.json())
    .then((data) => {
      console.log('Zones data:', data);
      setZones(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error('ERROR:', err.message);
      setLoading(false);
    });
  }, []); 

  const handleFormSubmit = async (e) => {
    alert(`Slot ${selectedSlot} in ${selectedZone} booked successfully!`);
    closeModal(); 
  };
  
  return (
    <div>
      <h2>Form to book a slot</h2>
      <p>Zone: {selectedZone}</p>
      <p>Slot: {selectedSlot}</p>
      <form onSubmit={handleFormSubmit}>
      <div>
          <label htmlFor="zoneSelect">Select Zone:</label>
          <select
            id="zoneSelect"
            value={selectedZoneValue} // Default value from selectedZone
            onChange={(e) => setSelectedZoneValue(e.target.value)} // Update selected zone
            required
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.name}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label htmlFor="vehicleRegNo">Vehicle Registration No:</label>
          <input
            id="vehicleRegNo"
            type="text"
            value={VehicleRegNo}
            onChange={(e) => setVehicleRegNo(e.target.value)}
            required
          />
        </div>
        <br />
        {vehicleInfo && (
          <div className="vehicle-info">
            <p>Vehicle Owner: {vehicleInfo.ownerName}</p>
            <p>Vehicle Type: {vehicleInfo.type}</p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SlotForm;
