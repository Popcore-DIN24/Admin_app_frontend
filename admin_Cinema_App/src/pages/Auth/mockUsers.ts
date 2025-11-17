export type MockUser = {
  username: string;
  password: string;
  role: 'admin' | 'employee';
  cinemaId: number;
};

const mockUsers: MockUser[] = [
  { username: 'admin_oulu', password: '123', role: 'admin', cinemaId: 1 },
  { username: 'employee_oulu', password: '123', role: 'employee', cinemaId: 1 },
  { username: 'admin_turku', password: '123', role: 'admin', cinemaId: 2 },
  { username: 'employee_turku', password: '123', role: 'employee', cinemaId: 2 },
  { username: 'admin_helsinki', password: '123', role: 'admin', cinemaId: 3 },
  { username: 'employee_helsinki', password: '123', role: 'employee', cinemaId: 3 },
];

export default mockUsers;
