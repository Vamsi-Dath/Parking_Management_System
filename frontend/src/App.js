import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Booking from './Booking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Booking />} />
      </Routes>
    </Router>
  );
}

export default App;


// {data ? (
//   <table>
//     <thead>
//       <tr>
//         <th>Slot ID</th>
//         <th>Vehicle Reg No</th>
//         <th>Zone Code</th>
//         <th>Type</th>
//       </tr>
//     </thead>
//     <tbody>
//       {data.map((item) => (
//         <tr key={item.SlotID}>
//           <td>{item.SlotID}</td>
//           <td>{item.VehicleRegNo}</td>
//           <td>{item.ZoneCode}</td>
//           <td>{item.Type}</td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// ) : (
//   <p>No data</p>
// )}

