import React from 'react';
import { useState } from 'react';
import './SlotForm.css';

const SlotForm = ({ selectedSlot, selectedZone, slotType, closeModal }) => {
  const [bookingInput, setBookingInput] = useState({ ownerID: '', firstName: '', lastName: '', VehicleRegNo: '', year: 2024, brand: '', zoneCode: selectedZone, slotID: selectedSlot, slotType: slotType, phoneNumber: '', additionalNumber: '' });
  const [error, setError] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Booking input:', bookingInput);
    setError(null);
    try {
      const response = await fetch('http://localhost:9000/api/book-slot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingInput),
      });

      if (!response.ok) {
        alert('Failed to book slot. Please try again later.');
      } else {
        alert(`Slot ${selectedSlot} in ${selectedZone} Zone is booked for vehicle type: ${slotType} successfully!`);
      }

    } catch (err) {
      setError(err.message);
    }
    
    closeModal();
  };

  return (
    <div>
      <h2>Book your slot now!</h2>
      <div className='zone-data'>
        <p>Zone: {selectedZone}</p>
        <p>Slot: {selectedSlot}</p>
      </div>
      <form onSubmit={handleFormSubmit} style={{ display: 'flex' }} action='/'>
        <br />
        <div className='book-slot' style={{ justifyContent: 'flex-start', justifyItems: 'left' }}>
          <div>
            <label htmlFor="vehicleRegNo">*Vehicle Registration No:</label>
            <input
              id="vehicleRegNo"
              type="text"
              value={bookingInput.VehicleRegNo}
              onChange={(e) => setBookingInput({ ...bookingInput, VehicleRegNo: e.target.value })}
              placeholder="AAXXXX"
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="type">Vehicle Brand:</label>
            <input
              id="brand"
              type="text"
              value={bookingInput.brand}
              onChange={(e) => setBookingInput({ ...bookingInput, brand: e.target.value })}
            />
          </div>
          <br />
          <div>
            <label htmlFor="type">Year of Manufacture:</label>
            <input
              type="number"
              min="1900"
              max="2024"
              step="1"
              value={bookingInput.year}
              onChange={(e) => setBookingInput({ ...bookingInput, year: e.target.value })}
            />
          </div>
        </div>
        <br />
        <div className="book-slot" style={{ justifyContent: 'flex-start', justifyItems: 'left' }}>
          <div>
            <label htmlFor="firstName">*Vehicle Owner(firstname) :</label>
            <input
              id="firstName"
              type="text"
              value={bookingInput.firstName}
              onChange={(e) => setBookingInput({ ...bookingInput, firstName: e.target.value })}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="lastName">*Vehicle Owner(lastname) :</label>
            <input
              id="lastName"
              type="text"
              value={bookingInput.lastName}
              onChange={(e) => setBookingInput({ ...bookingInput, lastName: e.target.value })}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="ownerID">*Owner(ID) :</label>
            <input
              id="ownerID"
              type="text"
              value={bookingInput.ownerID}
              onChange={(e) => setBookingInput({ ...bookingInput, ownerID: e.target.value })}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="phoneNumber">*Phone:</label>
            <input
              id="slotID"
              type="text"
              value={bookingInput.phoneNumber}
              onChange={(e) => setBookingInput({ ...bookingInput, phoneNumber: e.target.value })}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="additionalNumber">Other Phone:</label>
            <input
              id="slotID"
              type="text"
              value={bookingInput.additionalNumber}
              onChange={(e) => setBookingInput({ ...bookingInput, additionalNumber: e.target.value })}
            />
          </div>
          <br />
          <div style={{ justifyContent: 'flex-start' }}>
            <div>
              <p>Type: {slotType}</p>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
        <br />
        <div>
          <button type="submit" className="book-slot submit-button">Submit</button>
          <br />
          <button className="book-slot cancel-button" onClick={closeModal}>Cancel  </button>
        </div>
      </form>
    </div>
  );
};

export default SlotForm;
