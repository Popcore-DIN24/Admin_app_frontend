//import React from 'react'

export default function Movies() {
  return (
    <div>Movies</div>
  )
}

export interface MovieShowtime {
  cinema_id: number;
  hall_number: string;
  dates: string[];           // ['2025-11-20', '2025-11-21']
  show_times: string[];      // ['12:00', '15:00']
}
