
import React, { useState, useEffect, useMemo } from 'react';
import type { Club, Student, User } from '../types';
import Modal from './Modal';
import { PencilIcon, TrashIcon, PlusIcon } from './icons';

interface ClubManagementProps {
  clubs: Club[];
  students: Student[];
  addClub: (club: Omit<Club, 'id'>) => void;
  updateClub: (club: Club) => void;
  deleteClub: (clubId: string) => void;
  currentUser: User;
}

const ClubForm: React.FC<{
    onSubmit: (club: Omit<Club, 'id'> | Club) => void;
    allStudents: Student[];
    clubToEdit?: Club | null;
}> = ({ onSubmit, allStudents, clubToEdit }) => {
    const [name, setName] = useState('');
    const [advisor, setAdvisor] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (clubToEdit) {
            setName(clubToEdit.name);
            setAdvisor(clubToEdit.advisor);
            setSelectedMembers(new Set(clubToEdit.memberIds));
        } else {
            setName('');
            setAdvisor('');
            setSelectedMembers(new Set());
        }
    }, [clubToEdit]);

    const handleMemberToggle = (studentId: string) => {
        setSelectedMembers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(studentId)) {
                newSet.delete(studentId);
            } else {
                newSet.add(studentId);
            }
            return newSet;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const clubData = { name, advisor, memberIds: Array.from(selectedMembers) };
        if (clubToEdit) {
            onSubmit({ ...clubData, id: clubToEdit.id });
        } else {
            onSubmit(clubData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Club Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Faculty Advisor</label>
                <input type="text" value={advisor} onChange={e => setAdvisor(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Assign Members</label>
                <div className="mt-2 max-h-60 overflow-y-auto border border-slate-300 rounded-md p-2 space-y-2">
                    {allStudents.map(student => (
                        <div key={student.id} className="flex items-center">
                            <input
                                id={`student-${student.id}`}
                                type="checkbox"
                                checked={selectedMembers.has(student.id)}
                                onChange={() => handleMemberToggle(student.id)}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`student-${student.id}`} className="ml-3 text-sm text-slate-600">{student.name}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end pt-4">
                 <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    {clubToEdit ? 'Save Changes' : 'Create Club'}
                </button>
            </div>
        </form>
    );
}

const ClubManagement: React.FC<ClubManagementProps> = ({ clubs, students, addClub, updateClub, deleteClub, currentUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clubToEdit, setClubToEdit] = useState<Club | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddClick = () => {
        setClubToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (club: Club) => {
        setClubToEdit(club);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (clubId: string) => {
        if (window.confirm('Are you sure you want to delete this club? All associated attendance records will also be removed.')) {
            deleteClub(clubId);
        }
    };

    const handleFormSubmit = (clubData: Omit<Club, 'id'> | Club) => {
        if ('id' in clubData) {
            updateClub(clubData);
        } else {
            addClub(clubData);
        }
        setIsModalOpen(false);
    };

    const filteredClubs = useMemo(() => {
        if (!searchQuery) {
            return clubs;
        }
        return clubs.filter(club =>
            club.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [clubs, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Manage Clubs</h2>
                <button onClick={handleAddClick} className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                    <PlusIcon />
                    Create Club
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg">
                <div className="p-4 border-b border-slate-200">
                    <input
                        type="text"
                        placeholder="Search by club name..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="block w-full max-w-sm rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        aria-label="Search clubs"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Club Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Faculty Advisor</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Members</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredClubs.map(club => (
                                <tr key={club.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{club.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{club.advisor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{club.memberIds.length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handleEditClick(club)} className="text-indigo-600 hover:text-indigo-900 p-1"><PencilIcon /></button>
                                        {currentUser.role === 'admin' && (
                                            <button onClick={() => handleDeleteClick(club.id)} className="text-red-600 hover:text-red-900 p-1"><TrashIcon /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredClubs.length === 0 && (
                        <div className="text-center p-6 text-slate-500">
                            No clubs found matching your search.
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={clubToEdit ? 'Edit Club' : 'Create New Club'}>
                <ClubForm onSubmit={handleFormSubmit} allStudents={students} clubToEdit={clubToEdit} />
            </Modal>
        </div>
    );
};

export default ClubManagement;