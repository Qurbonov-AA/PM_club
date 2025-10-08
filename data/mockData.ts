import type { Student, Club, Attendance, User } from '../types';

export const initialUsers: User[] = [
  { id: 'u1', name: 'Admin User', username: 'admin', password: 'password', role: 'admin' },
  { id: 'u2', name: 'John Teacher', username: 'teacher1', password: 'password', role: 'teacher' },
  { id: 'u3', name: 'Jane Teacher', username: 'teacher2', password: 'password', role: 'teacher' },
];

const originalStudents: Omit<Student, 'grade' | 'photoUrl'>[] = [
  { id: 's1', name: 'Liam Smith', studentId: 'S001'},
  { id: 's2', name: 'Olivia Johnson', studentId: 'S002'},
  { id: 's3', name: 'Noah Williams', studentId: 'S003'},
  { id: 's4', name: 'Emma Brown', studentId: 'S004'},
  { id: 's5', name: 'Oliver Jones', studentId: 'S005'},
  { id: 's6', name: 'Ava Garcia', studentId: 'S006'},
  { id: 's7', name: 'Elijah Miller', studentId: 'S007'},
  { id: 's8', name: 'Charlotte Davis', studentId: 'S008'},
  { id: 's9', name: 'William Rodriguez', studentId: 'S009'},
  { id: 's10', name: 'Sophia Martinez', studentId: 'S010'},
  { id: 's11', name: 'James Hernandez', studentId: 'S011'},
  { id: 's12', name: 'Amelia Lopez', studentId: 'S012'},
  { id: 's13', name: 'Benjamin Gonzalez', studentId: 'S013'},
  { id: 's14', name: 'Isabella Wilson', studentId: 'S014'},
  { id: 's15', name: 'Lucas Anderson', studentId: 'S015'},
  { id: 's16', name: 'Mia Thomas', studentId: 'S016'},
  { id: 's17', name: 'Henry Taylor', studentId: 'S017'},
  { id: 's18', name: 'Evelyn Moore', studentId: 'S018'},
  { id: 's19', name: 'Alexander Jackson', studentId: 'S019'},
  { id: 's20', name: 'Harper White', studentId: 'S020'},
  { id: 's21', name: 'Sebastian Harris', studentId: 'S021'},
  { id: 's22', name: 'Abigail Martin', studentId: 'S022'},
  { id: 's23', name: 'Michael Thompson', studentId: 'S023'},
  { id: 's24', name: 'Emily Garcia', studentId: 'S024'}
];

const firstNames = ['Mason', 'Ethan', 'Logan', 'Lucas', 'Jackson', 'Aiden', 'Elijah', 'James', 'Benjamin', 'Henry', 'Zoe', 'Lily', 'Chloe', 'Grace', 'Riley', 'Nora', 'Scarlett', 'Mila', 'Aubrey', 'Hannah'];
const lastNames = ['Lee', 'Kim', 'Patel', 'Chen', 'Singh', 'Wang', 'Ali', 'Das', 'Khan', 'Kumar', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner'];

// Generate 144 additional students to reach 168 total
const additionalStudents: Omit<Student, 'grade' | 'photoUrl'>[] = [];
for (let i = 0; i < 144; i++) {
    const studentNum = i + 25;
    additionalStudents.push({
        id: `s${studentNum}`,
        name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
        studentId: `S${String(studentNum).padStart(3, '0')}`
    });
}

const allStudentBases = [...originalStudents, ...additionalStudents];

const grades = ['5th', '6th', '7th', '8th', '9th', '10th', '11th'];
const studentGrades: string[] = [];

grades.forEach(grade => {
    // 12 Green students for this grade
    for (let i = 0; i < 12; i++) {
        studentGrades.push(`${grade} Green`);
    }
    // 12 Blue students for this grade
    for (let i = 0; i < 12; i++) {
        studentGrades.push(`${grade} Blue`);
    }
});

export const initialStudents: Student[] = allStudentBases.map((student, index) => ({
    ...student,
    grade: studentGrades[index],
    photoUrl: `https://picsum.photos/seed/${student.id}/100`,
}));


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