
export type Page = 'dashboard' | 'students' | 'clubs' | 'attendance' | 'teachers' | 'classes';

export type Role = 'admin' | 'teacher';

export interface User {
  id: string;
  username: string;
  password?: string; // Password might not always be present in client-side data
  name: string;
  role: Role;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  photoUrl: string;
}

export interface Club {
  id:string;
  name: string;
  advisor: string;
  memberIds: string[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  [studentId: string]: AttendanceStatus;
}

export interface Attendance {
  id: string;
  clubId: string;
  date: string; // YYYY-MM-DD
  records: AttendanceRecord;
}
