export interface Theater {
  id: string;
  name: string;
  city: string;
}

export interface Hall {
  id: string;
  name: string;
  capacity: number;
}

export interface ShowTime {
  id: string;
  movie: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  capacity: number;
}
