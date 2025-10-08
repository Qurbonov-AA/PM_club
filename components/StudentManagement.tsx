import React, { useState, useEffect, useMemo } from 'react';
import type { Student } from '../types';
import Modal from './Modal';
import { PencilIcon, TrashIcon, PlusIcon } from './icons';

interface StudentManagementProps {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
}

const StudentForm: React.FC<{
    onSubmit: (student: Omit<Student, 'id'> | Student) => void;
    studentToEdit?: Student | null;
}> = ({ onSubmit, studentToEdit }) => {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [grade, setGrade] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    useEffect(() => {
        if (studentToEdit) {
            setName(studentToEdit.name);
            setStudentId(studentToEdit.studentId);
            setGrade(studentToEdit.grade);
            setPhotoUrl(studentToEdit.photoUrl);
        } else {
            setName('');
            setStudentId('');
            setGrade('');
            setPhotoUrl('');
        }
    }, [studentToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const studentData = { name, studentId, grade, photoUrl: photoUrl || `https://picsum.photos/seed/${studentId || Date.now()}/100` };
        if (studentToEdit) {
            onSubmit({ ...studentData, id: studentToEdit.id });
        } else {
            onSubmit(studentData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Student ID</label>
                <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Grade/Class</label>
                <input type="text" value={grade} onChange={e => setGrade(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Photo URL (Optional)</label>
                <input type="text" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    {studentToEdit ? 'Save Changes' : 'Add Student'}
                </button>
            </div>
        </form>
    );
};

const StudentManagement: React.FC<StudentManagementProps> = ({ students, addStudent, updateStudent, deleteStudent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddClick = () => {
        setStudentToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (student: Student) => {
        setStudentToEdit(student);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (studentId: string) => {
        if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            deleteStudent(studentId);
        }
    };

    const handleFormSubmit = (studentData: Omit<Student, 'id'> | Student) => {
        if ('id' in studentData) {
            updateStudent(studentData);
        } else {
            addStudent(studentData);
        }
        setIsModalOpen(false);
    };

    const filteredStudents = useMemo(() => {
        if (!searchQuery) {
            return students;
        }
        return students.filter(student =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [students, searchQuery]);
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Manage Students</h2>
                <button onClick={handleAddClick} className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                    <PlusIcon />
                    Add Student
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by student name..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="block w-full max-w-sm rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        aria-label="Search students"
                    />
                </div>
                
                {filteredStudents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredStudents.map(student => (
                            <div key={student.id} className="bg-slate-50 rounded-lg shadow-sm p-4 text-center relative group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button onClick={() => handleEditClick(student)} className="text-slate-500 hover:text-indigo-600 p-1.5 bg-white rounded-full shadow-md hover:bg-indigo-50 transition-colors">
                                        <PencilIcon />
                                    </button>
                                    <button onClick={() => handleDeleteClick(student.id)} className="text-slate-500 hover:text-red-600 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
                                        <TrashIcon />
                                    </button>
                                </div>
                                <img className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg" src={student.photoUrl} alt={student.name} />
                                <h3 className="text-md font-bold text-slate-800 truncate" title={student.name}>{student.name}</h3>
                                <p className="text-sm text-slate-600">{student.grade}</p>
                                <p className="text-xs text-slate-400 mt-1">ID: {student.studentId}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-500">
                        <h3 className="text-xl font-semibold">No Students Found</h3>
                        <p className="mt-2">There are no students matching your search criteria.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={studentToEdit ? 'Edit Student' : 'Add New Student'}>
                <StudentForm onSubmit={handleFormSubmit} studentToEdit={studentToEdit} />
            </Modal>
        </div>
    );
};

export default StudentManagement;