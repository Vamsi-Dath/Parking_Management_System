import './App.css';
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
