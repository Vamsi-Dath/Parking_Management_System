import React from "react";
import Booking from "./Booking";
import OwnerFilter from "./OwnerFilter";

function App() {
  return (
    <div className="App">
      <h1>Parking Management System</h1>
      <Booking />
      <hr />
      <OwnerFilter />
    </div>
  );
}

export default App;
