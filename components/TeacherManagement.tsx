
import React, { useState, useEffect } from 'react';
import type { User, Role } from '../types';
import Modal from './Modal';
import { PencilIcon, TrashIcon, PlusIcon } from './icons';

interface TeacherManagementProps {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
}

const UserForm: React.FC<{
    onSubmit: (user: Omit<User, 'id'> | User) => void;
    userToEdit?: User | null;
}> = ({ onSubmit, userToEdit }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('teacher');

    useEffect(() => {
        if (userToEdit) {
            setName(userToEdit.name);
            setUsername(userToEdit.username);
            setRole(userToEdit.role);
            setPassword(''); // Don't pre-fill password for security
        } else {
            setName('');
            setUsername('');
            setPassword('');
            setRole('teacher');
        }
    }, [userToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!userToEdit && !password) {
            alert("Password is required for new users.");
            return;
        }

        const userData: Omit<User, 'id' | 'password'> & { password?: string } = { name, username, role };
        if (password) {
            userData.password = password;
        }
        
        if (userToEdit) {
            onSubmit({ ...userData, id: userToEdit.id });
        } else {
            onSubmit(userData as Omit<User, 'id'>);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={userToEdit ? 'Leave blank to keep unchanged' : ''} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Role</label>
                <select value={role} onChange={e => setRole(e.target.value as Role)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    {userToEdit ? 'Save Changes' : 'Add User'}
                </button>
            </div>
        </form>
    );
};

const TeacherManagement: React.FC<TeacherManagementProps> = ({ users, addUser, updateUser, deleteUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const handleAddClick = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (user: User) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(userId);
        }
    };

    const handleFormSubmit = (userData: Omit<User, 'id'> | User) => {
        if ('id' in userData) {
            updateUser(userData);
        } else {
            addUser(userData);
        }
        setIsModalOpen(false);
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Manage Teachers & Admins</h2>
                <button onClick={handleAddClick} className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                    <PlusIcon />
                    Add User
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Username</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handleEditClick(user)} className="text-indigo-600 hover:text-indigo-900 p-1"><PencilIcon /></button>
                                        <button onClick={() => handleDeleteClick(user.id)} className="text-red-600 hover:text-red-900 p-1"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={userToEdit ? 'Edit User' : 'Add New User'}>
                <UserForm onSubmit={handleFormSubmit} userToEdit={userToEdit} />
            </Modal>
        </div>
    );
};

export default TeacherManagement;
