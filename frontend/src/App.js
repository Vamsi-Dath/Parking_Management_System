import React from "react";
import Booking from "./Booking";
import OwnerFilter from "./OwnerFilter";
import TradingSlots from "./TradingSlots"; // Import the new component

function App() {
  return (
    <div className="App">
      <Booking />
      <hr />
      <OwnerFilter />
      <hr />
      <TradingSlots /> {/* Add TradingSlots component here */}
    </div>
  );
}

export default App;
