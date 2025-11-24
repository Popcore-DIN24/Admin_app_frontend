import React, { useState } from 'react';
import TheaterSelect from '../../components/TheaterSelect';
import HallTable from '../../components/HallTable';
import ShowTimeTable from '../../components/ShowTimeTable';
import Reports from '../../components/Reports';
import type { Theater, Hall } from '../../types/index';
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";
import './Cinemamanagement.css';

const Cinemamanagement: React.FC = () => {
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);

  console.log('Selected Theater:', selectedTheater);
  console.log('Selected Hall:', selectedHall);

  return (
    <div className="cinema-dashboard-page">
      <AdminNavbar />

      <div className="cinema-dashboard-container">
        {/* Cinema Selector */}
        <div className="cinema-panel">
          <h1>Cinema Management</h1>
          <TheaterSelect onSelect={setSelectedTheater} />
        </div>

        {/* Hall Table */}
        {selectedTheater && (
          <div className="cinema-panel">
            <HallTable theater={selectedTheater} onManageHall={setSelectedHall} />
          </div>
        )}

        {/* ShowTime Table */}
        {selectedHall && (
          <div className="cinema-panel showtime-panel">
            <ShowTimeTable hall={selectedHall} />
          </div>
        )}

        {/* Reports */}
        {selectedTheater && (
          <div className="cinema-panel reports-panel">
            <Reports theater={selectedTheater} />
          </div>
        )}
      </div>

      <LoginFooter />
    </div>
  );
};

export default Cinemamanagement;
