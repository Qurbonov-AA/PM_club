
import React, { useState, useCallback, useEffect } from 'react';
import type { Page, Student, Club, Attendance, User } from './types';
import { initialStudents, initialClubs, initialAttendance, initialUsers } from './data/mockData';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import ClubManagement from './components/ClubManagement';
import AttendanceTracking from './components/AttendanceTracking';
import TeacherManagement from './components/TeacherManagement';
import Login from './components/Login';
import ClassAssignment from './components/ClassAssignment';

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string>('');

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    // If a non-admin user is on the teachers page, redirect them
    if (currentUser?.role !== 'admin' && page === 'teachers') {
      setPage('dashboard');
    }
  }, [currentUser, page]);

  const handleLogin = (username: string, password: string): void => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
      setPage('dashboard');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    setStudents(prev => [...prev, { ...student, id: `s${Date.now()}` }]);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setClubs(prevClubs => prevClubs.map(club => ({
      ...club,
      memberIds: club.memberIds.filter(id => id !== studentId)
    })));
  };

  const addClub = (club: Omit<Club, 'id'>) => {
    setClubs(prev => [...prev, { ...club, id: `c${Date.now()}` }]);
  };

  const updateClub = (updatedClub: Club) => {
    setClubs(prev => prev.map(c => c.id === updatedClub.id ? updatedClub : c));
  };

  const deleteClub = (clubId: string) => {
    setClubs(prev => prev.filter(c => c.id !== clubId));
    setAttendance(prev => prev.filter(a => a.clubId !== clubId));
  };

  const saveAttendance = useCallback((newAttendance: Omit<Attendance, 'id'>) => {
    setAttendance(prev => {
      const existingIndex = prev.findIndex(a => a.clubId === newAttendance.clubId && a.date === newAttendance.date);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], records: newAttendance.records };
        return updated;
      }
      return [...prev, { ...newAttendance, id: `a${Date.now()}` }];
    });
  }, []);

  const addUser = (user: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...user, id: `u${Date.now()}` }]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const assignStudentsToClass = (studentIds: string[], newGrade: string) => {
    setStudents(prev =>
        prev.map(student =>
            studentIds.includes(student.id) ? { ...student, grade: newGrade } : student
        )
    );
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard students={students} clubs={clubs} attendance={attendance} />;
      case 'students':
        return <StudentManagement students={students} addStudent={addStudent} updateStudent={updateStudent} deleteStudent={deleteStudent} />;
      case 'clubs':
        return <ClubManagement clubs={clubs} students={students} addClub={addClub} updateClub={updateClub} deleteClub={deleteClub} currentUser={currentUser} />;
      case 'attendance':
        return <AttendanceTracking clubs={clubs} students={students} attendanceRecords={attendance} saveAttendance={saveAttendance} />;
      case 'classes':
        return <ClassAssignment students={students} assignStudentsToClass={assignStudentsToClass} />;
      case 'teachers':
        if (currentUser.role === 'admin') {
          return <TeacherManagement users={users} addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} />;
        }
        return <Dashboard students={students} clubs={clubs} attendance={attendance} />;
      default:
        return <Dashboard students={students} clubs={clubs} attendance={attendance} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header currentPage={page} setPage={setPage} currentUser={currentUser} onLogout={handleLogout} />
      <main className="p-4 sm:p-6 md:p-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
