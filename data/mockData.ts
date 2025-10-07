
import type { Student, Club, Attendance, User } from '../types';

export const initialUsers: User[] = [
  { id: 'u1', name: 'Admin User', username: 'admin', password: 'password', role: 'admin' },
  { id: 'u2', name: 'John Teacher', username: 'teacher1', password: 'password', role: 'teacher' },
  { id: 'u3', name: 'Jane Teacher', username: 'teacher2', password: 'password', role: 'teacher' },
];

export const initialStudents: Student[] = [
  { id: 's1', name: 'Liam Smith', studentId: 'S001', grade: '10th', photoUrl: 'https://picsum.photos/seed/s1/100' },
  { id: 's2', name: 'Olivia Johnson', studentId: 'S002', grade: '11th', photoUrl: 'https://picsum.photos/seed/s2/100' },
  { id: 's3', name: 'Noah Williams', studentId: 'S003', grade: '9th', photoUrl: 'https://picsum.photos/seed/s3/100' },
  { id: 's4', name: 'Emma Brown', studentId: 'S004', grade: '12th', photoUrl: 'https://picsum.photos/seed/s4/100' },
  { id: 's5', name: 'Oliver Jones', studentId: 'S005', grade: '10th', photoUrl: 'https://picsum.photos/seed/s5/100' },
  { id: 's6', name: 'Ava Garcia', studentId: 'S006', grade: '11th', photoUrl: 'https://picsum.photos/seed/s6/100' },
  { id: 's7', name: 'Elijah Miller', studentId: 'S007', grade: '9th', photoUrl: 'https://picsum.photos/seed/s7/100' },
  { id: 's8', name: 'Charlotte Davis', studentId: 'S008', grade: '12th', photoUrl: 'https://picsum.photos/seed/s8/100' },
  { id: 's9', name: 'William Rodriguez', studentId: 'S009', grade: '10th', photoUrl: 'https://picsum.photos/seed/s9/100' },
  { id: 's10', name: 'Sophia Martinez', studentId: 'S010', grade: '11th', photoUrl: 'https://picsum.photos/seed/s10/100' },
  { id: 's11', name: 'James Hernandez', studentId: 'S011', grade: '9th', photoUrl: 'https://picsum.photos/seed/s11/100' },
  { id: 's12', name: 'Amelia Lopez', studentId: 'S012', grade: '12th', photoUrl: 'https://picsum.photos/seed/s12/100' },
  { id: 's13', name: 'Benjamin Gonzalez', studentId: 'S013', grade: '10th', photoUrl: 'https://picsum.photos/seed/s13/100' },
  { id: 's14', name: 'Isabella Wilson', studentId: 'S014', grade: '11th', photoUrl: 'https://picsum.photos/seed/s14/100' },
  { id: 's15', name: 'Lucas Anderson', studentId: 'S015', grade: '9th', photoUrl: 'https://picsum.photos/seed/s15/100' },
  { id: 's16', name: 'Mia Thomas', studentId: 'S016', grade: '12th', photoUrl: 'https://picsum.photos/seed/s16/100' },
  { id: 's17', name: 'Henry Taylor', studentId: 'S017', grade: '10th', photoUrl: 'https://picsum.photos/seed/s17/100' },
  { id: 's18', name: 'Evelyn Moore', studentId: 'S018', grade: '11th', photoUrl: 'https://picsum.photos/seed/s18/100' },
  { id: 's19', name: 'Alexander Jackson', studentId: 'S019', grade: '9th', photoUrl: 'https://picsum.photos/seed/s19/100' },
  { id: 's20', name: 'Harper White', studentId: 'S020', grade: '12th', photoUrl: 'https://picsum.photos/seed/s20/100' },
  { id: 's21', name: 'Sebastian Harris', studentId: 'S021', grade: '10th', photoUrl: 'https://picsum.photos/seed/s21/100' },
  { id: 's22', name: 'Abigail Martin', studentId: 'S022', grade: '11th', photoUrl: 'https://picsum.photos/seed/s22/100' },
  { id: 's23', name: 'Michael Thompson', studentId: 'S023', grade: '9th', photoUrl: 'https://picsum.photos/seed/s23/100' },
  { id: 's24', name: 'Emily Garcia', studentId: 'S024', grade: '12th', photoUrl: 'https://picsum.photos/seed/s24/100' }
];

export const initialClubs: Club[] = [
  { id: 'c1', name: 'Debate Club', advisor: 'Mr. Peterson', memberIds: ['s1', 's2', 's3', 's4', 's5', 's20'] },
  { id: 'c2', name: 'Science Olympiad', advisor: 'Ms. Chen', memberIds: ['s6', 's7', 's8', 's9', 's10', 's21'] },
  { id: 'c3', name: 'Art Club', advisor: 'Mrs. Diaz', memberIds: ['s11', 's12', 's13', 's14', 's15', 's22'] },
  { id: 'c4', name: 'Coding Club', advisor: 'Mr. Smith', memberIds: ['s16', 's17', 's18', 's19', 's1', 's8', 's23'] },
  { id: 'c5', name: 'Literary Magazine', advisor: 'Ms. Rowling', memberIds: ['s20', 's21', 's22', 's23', 's24', 's2', 's12'] }
];

const getPastDate = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

export const initialAttendance: Attendance[] = [
    { 
        id: 'a1', 
        clubId: 'c1', 
        date: getPastDate(1),
        records: { 's1': 'present', 's2': 'present', 's3': 'absent', 's4': 'late', 's5': 'present', 's20': 'present' }
    },
    { 
        id: 'a2', 
        clubId: 'c2', 
        date: getPastDate(1),
        records: { 's6': 'present', 's7': 'present', 's8': 'present', 's9': 'present', 's10': 'present', 's21': 'absent' }
    },
    { 
        id: 'a3', 
        clubId: 'c4', 
        date: getPastDate(2),
        records: { 's16': 'present', 's17': 'late', 's18': 'late', 's19': 'present', 's1': 'absent', 's8': 'present', 's23': 'present' }
    },
    {
        id: 'a4',
        clubId: 'c1',
        date: getPastDate(8),
        records: { 's1': 'present', 's2': 'absent', 's3': 'present', 's4': 'present', 's5': 'present', 's20': 'late' }
    }
];
