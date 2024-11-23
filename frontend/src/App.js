import './App.css';
import { useEffect, useState } from 'react';

function App() {
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

  return (
    <div className="App">
      <h1>Parking Management System</h1>
      <div>
        <h2>Parking Slots</h2>
        {data ? (
          <table>
            <thead>
              <tr>
                <th>Slot ID</th>
                <th>Vehicle Reg No</th>
                <th>Zone Code</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.SlotID}>
                  <td>{item.SlotID}</td>
                  <td>{item.VehicleRegNo}</td>
                  <td>{item.ZoneCode}</td>
                  <td>{item.Type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
}

export default App;
