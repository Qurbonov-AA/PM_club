import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { Student, Club, Attendance, AttendanceStatus } from '../types';
import { getTodayDateString } from '../utils/helpers';
import { UsersIcon, CubeIcon } from './icons';
import Modal from './Modal';

interface DashboardProps {
  students: Student[];
  clubs: Club[];
  attendance: Attendance[];
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div className="bg-indigo-100 text-indigo-600 rounded-full p-3">
            {icon}
        </div>
    </div>
);

const statusStyles: { [key in AttendanceStatus]: { border: string; bg: string; badge: string } } = {
  present: {
    border: 'border-emerald-500',
    bg: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  absent: {
    border: 'border-red-500',
    bg: 'bg-red-50',
    badge: 'bg-red-100 text-red-800'
  },
  late: {
    border: 'border-amber-500',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-800'
  }
};


const Dashboard: React.FC<DashboardProps> = ({ students, clubs, attendance }) => {
    const [filter, setFilter] = useState<'weekly' | 'monthly'>('weekly');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{ title: string; students: Student[] }>({ title: '', students: [] });
    const today = getTodayDateString();

    const chartData = useMemo(() => {
        const now = new Date();
        const daysToFilter = filter === 'weekly' ? 7 : 30;
        
        const cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - daysToFilter);
        const cutoffDateString = cutoffDate.toISOString().split('T')[0];

        const filteredAttendance = attendance.filter(a => a.date >= cutoffDateString);
        
        const stats = { present: 0, absent: 0, late: 0 };
        filteredAttendance.forEach(att => {
            Object.values(att.records).forEach(status => {
                if (status === 'present') stats.present++;
                if (status === 'absent') stats.absent++;
                if (status === 'late') stats.late++;
            });
        });

        return [
            { name: 'Present', count: stats.present, fill: '#10B981' }, // Emerald-500
            { name: 'Absent', count: stats.absent, fill: '#EF4444' },   // Red-500
            { name: 'Late', count: stats.late, fill: '#F59E0B' },      // Amber-500
        ];
    }, [attendance, filter]);

    const todaysAttendanceWithDetails = useMemo(() => {
        const todaysRecords: { [studentId: string]: { student: Student; status: AttendanceStatus } } = {};
        const todayAttendances = attendance.filter(a => a.date === today);
        
        todayAttendances.forEach(att => {
            Object.entries(att.records).forEach(([studentId, status]) => {
                const existing = todaysRecords[studentId];
                // Prioritize status: present > late > absent. If student is present in one club, that's their status for the day.
                if (!existing || (status === 'present') || (status === 'late' && existing.status === 'absent')) {
                    const student = students.find(s => s.id === studentId);
                    if (student) {
                        todaysRecords[studentId] = { student, status };
                    }
                }
            });
        });

        const details = Object.values(todaysRecords);

        // Sort list: present -> late -> absent
        details.sort((a, b) => {
            const order = { present: 0, late: 1, absent: 2 };
            return order[a.status] - order[b.status];
        });

        return details;
    }, [attendance, students, today]);
    
    const handleBarClick = (data: any) => {
        if (!data || !data.name) return;

        const status = data.name.toLowerCase() as AttendanceStatus;
        const now = new Date();
        const daysToFilter = filter === 'weekly' ? 7 : 30;
        const cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - daysToFilter);
        const cutoffDateString = cutoffDate.toISOString().split('T')[0];

        const relevantAttendance = attendance.filter(a => a.date >= cutoffDateString);
        const studentIds = new Set<string>();

        relevantAttendance.forEach(att => {
            Object.entries(att.records).forEach(([studentId, recordStatus]) => {
                if (recordStatus === status) {
                    studentIds.add(studentId);
                }
            });
        });

        const filteredStudents = students.filter(s => studentIds.has(s.id));
        
        setModalData({
            title: `${data.name} Students (${filter})`,
            students: filteredStudents
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Students" value={students.length} icon={<UsersIcon />} />
                <StatCard title="Total Clubs" value={clubs.length} icon={<CubeIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-12 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-700">Attendance Overview</h3>
                        <div className="flex space-x-2">
                            <button onClick={() => setFilter('weekly')} className={`px-3 py-1 text-sm rounded-md ${filter === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Weekly</button>
                            <button onClick={() => setFilter('monthly')} className={`px-3 py-1 text-sm rounded-md ${filter === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Monthly</button>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" name="Students" onClick={handleBarClick} cursor="pointer">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                 <div className="bg-white p-12 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Today's Attendance Status</h3>
                    {todaysAttendanceWithDetails.length > 0 ? (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {todaysAttendanceWithDetails.map(({ student, status }) => (
                                <div key={student.id} className={`flex items-center p-3 rounded-lg border-l-4 transition-colors duration-200 ${statusStyles[status].bg} ${statusStyles[status].border}`}>
                                    <img src={student.photoUrl} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="ml-4 flex-grow">
                                        <p className="font-semibold text-slate-800">{student.name}</p>
                                        <p className="text-sm text-slate-500">{student.grade} Grade</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyles[status].badge}`}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>No attendance recorded for today yet.</p>
                        </div>
                    )}
                </div>
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalData.title}>
                {modalData.students.length > 0 ? (
                    <ul className="space-y-3 max-h-96 overflow-y-auto">
                        {modalData.students.map(student => (
                            <li key={student.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50">
                                <img src={student.photoUrl} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-medium text-slate-800">{student.name}</p>
                                    <p className="text-sm text-slate-500">{student.grade} Grade</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-center py-4">No students found for this category.</p>
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;
