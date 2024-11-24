import './Booking.css';
import { useEffect, useState } from 'react';

function Booking() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <h2>Parking Slots</h2>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {Object.keys(groupedData).map((zone) => (
              <div className="zone" key={zone.slotId}>
                <h3 style={{ textAlign: 'center' }}>Zone {zone}</h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {groupedData[zone].map((slot) => (
                    <div key={slot.slotId} className={slot.VehicleRegNo ? 'slot red' : 'slot green'}
                    title={
                      slot.VehicleRegNo
                        ? `${slot.SlotID} - Occupied: Vehicle Registration No.: ${slot.VehicleRegNo}`
                        : `${slot.SlotID} - Empty`
                    }
                    >
                      {slot.SlotID} 
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
