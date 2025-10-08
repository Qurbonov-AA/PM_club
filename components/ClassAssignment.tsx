
import React, { useState, useMemo, useEffect } from 'react';
import type { Student } from '../types';

interface ClassAssignmentProps {
  students: Student[];
  assignStudentsToClass: (studentIds: string[], newGrade: string) => void;
}

const ClassAssignment: React.FC<ClassAssignmentProps> = ({ students, assignStudentsToClass }) => {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [targetClass, setTargetClass] = useState<string>('');

  const groupedStudents = useMemo(() => {
    const groups: { [key: string]: Student[] } = { 'Unassigned': [] };
    students.forEach(student => {
      const groupKey = student.grade || 'Unassigned';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(student);
    });
    // Sort groups by name, with Unassigned first
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === 'Unassigned') return -1;
      if (b === 'Unassigned') return 1;
      return a.localeCompare(b);
    });
  }, [students]);

  const allGrades = useMemo(() => {
    const gradeSet = new Set(students.map(s => s.grade).filter(Boolean) as string[]);
    return ['Unassigned', ...Array.from(gradeSet).sort()];
  }, [students]);

  useEffect(() => {
    if (allGrades.length > 0 && !targetClass) {
      setTargetClass(allGrades[0]);
    }
  }, [allGrades, targetClass]);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleMoveStudents = () => {
    if (selectedStudents.size === 0) {
      alert('Please select students to move.');
      return;
    }
    if (targetClass === undefined) {
      alert('Please select a target class.');
      return;
    }
    const finalTargetClass = targetClass === 'Unassigned' ? '' : targetClass;
    assignStudentsToClass(Array.from(selectedStudents), finalTargetClass);
    setSelectedStudents(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Class Assignments</h2>
      </div>
      
      {selectedStudents.size > 0 && (
        <div className="sticky top-[65px] md:top-[81px] z-30 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
          <span className="font-medium text-slate-700">{selectedStudents.size} student(s) selected</span>
          <div className="flex items-center gap-2">
            <label htmlFor="target-class" className="text-sm font-medium text-slate-600">Move to:</label>
            <select
              id="target-class"
              value={targetClass}
              onChange={e => setTargetClass(e.target.value)}
              className="rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {allGrades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            <button
              onClick={handleMoveStudents}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Move
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groupedStudents.map(([grade, studentList]) => (
          <div key={grade} className="bg-white rounded-lg shadow-md flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 p-4 border-b border-slate-200">{grade} ({studentList.length})</h3>
            <ul className="p-4 space-y-3 flex-grow overflow-y-auto" style={{maxHeight: '30rem'}}>
              {studentList.length > 0 ? studentList.map(student => (
                <li key={student.id}>
                  <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-100 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <img src={student.photoUrl} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-sm text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">ID: {student.studentId}</p>
                    </div>
                  </label>
                </li>
              )) : (
                <li className="text-sm text-slate-500 text-center py-4">No students in this class.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassAssignment;
