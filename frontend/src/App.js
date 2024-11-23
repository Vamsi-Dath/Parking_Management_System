import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:9000/api/parking-spots')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <h1>Parking Management System</h1>
      <div>
        {data ? (
          <ul>
            {data.map((item) => (
              <li key={item.SlotID}>
                <h2>{item.SlotID}</h2>
                <h2>{item.VehicleRegNo}</h2>
                <h2>{item.ZoneCode}</h2>
                <h2>{item.Type}</h2>
              </li>
            ))}
          </ul>
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
}

export default App;
