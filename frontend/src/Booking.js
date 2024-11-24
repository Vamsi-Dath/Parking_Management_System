import './Booking.css';
import { useEffect, useState } from 'react';
import SlotForm from './SlotForm';

function Booking() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState(null);

  const handleOpenModal = (zone, slot) => {
    setSelectedZone(zone);
    setSelectedSlot(slot);
    setShowModal(true);
  };


  useEffect(() => {
    fetch('/api/parking-spots')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched data:', data);
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('ERROR:', err.message);
        setLoading(false);
      });

    fetch('/api/getZones')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched data:', data);
        setZone(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('ERROR:', err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const groupedData = data.reduce((acc, slot) => {
    acc[slot.ZoneCode] = acc[slot.ZoneCode] || []; 
    acc[slot.ZoneCode].push(slot); 
    return acc;
  }, {});
  console.log('grouped data', groupedData);
  return (
    
    <div className="App">
      <h1>Parking Management System</h1>
      <div>
        <h2>ParkingZones</h2>
        <div>
          <select>
            <option>Select Zone</option>
            {zone.map((zone) => (
              <option key={zone.ZoneCode}>{zone.ZoneCode}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <h2>Parking Slots</h2>
        <div style={{ padding: '20px' }}>
          <div className = "ParkingZones">
            {Object.keys(groupedData).map((zone) => (
              <div className="zone" key={zone.slotId}>
                <h3 style={{ textAlign: 'center' }}>Zone {zone}</h3>
                <hr className = "line" />

                <div className='parkingSlots'>
                  {groupedData[zone].map((slot) => (
                    <div key={slot.SlotID} className={slot.VehicleRegNo ? 'slot red' : 'slot green'}
                    title={
                      slot.VehicleRegNo
                        ? `${slot.SlotID} - Occupied;\nVehicle Reg. No.: ${slot.VehicleRegNo}; \nType: ${slot.Type};`
                        : `${slot.SlotID} - Empty; \nType: ${slot.Type};\nClick to book the slot`
                    }
                    onClick={() => !slot.VehicleRegNo && handleOpenModal(slot.ZoneCode, slot.SlotID)}
                    >
                      {slot.SlotID} 
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
                <SlotForm
                  selectedSlot={selectedSlot}
                  selectedZone={selectedZone}
                  closeModal={() => setShowModal(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Booking;
