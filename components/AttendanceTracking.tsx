
import React, { useState, useEffect, useMemo } from 'react';
import type { Club, Student, Attendance, AttendanceRecord, AttendanceStatus } from '../types';
import { getTodayDateString } from '../utils/helpers';

interface AttendanceTrackingProps {
  clubs: Club[];
  students: Student[];
  attendanceRecords: Attendance[];
  saveAttendance: (attendance: Omit<Attendance, 'id'>) => void;
}

const statusColors: { [key in AttendanceStatus]: string } = {
    present: 'bg-emerald-100 border-emerald-500 text-emerald-800',
    absent: 'bg-red-100 border-red-500 text-red-800',
    late: 'bg-amber-100 border-amber-500 text-amber-800'
};

const statusButtonColors: { [key in AttendanceStatus]: { active: string, inactive: string } } = {
    present: { active: 'bg-emerald-500 text-white', inactive: 'bg-slate-200 text-slate-700 hover:bg-emerald-200' },
    absent: { active: 'bg-red-500 text-white', inactive: 'bg-slate-200 text-slate-700 hover:bg-red-200' },
    late: { active: 'bg-amber-500 text-white', inactive: 'bg-slate-200 text-slate-700 hover:bg-amber-200' }
};

const AttendanceTracking: React.FC<AttendanceTrackingProps> = ({ clubs, students, attendanceRecords, saveAttendance }) => {
    const [selectedClubId, setSelectedClubId] = useState<string>(clubs[0]?.id || '');
    const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
    const [currentAttendance, setCurrentAttendance] = useState<AttendanceRecord>({});

    const clubMembers = useMemo(() => {
        const selectedClub = clubs.find(c => c.id === selectedClubId);
        if (!selectedClub) return [];
        return students.filter(s => selectedClub.memberIds.includes(s.id));
    }, [selectedClubId, clubs, students]);

    useEffect(() => {
        const existingRecord = attendanceRecords.find(
            a => a.clubId === selectedClubId && a.date === selectedDate
        );
        if (existingRecord) {
            setCurrentAttendance(existingRecord.records);
        } else {
            // Initialize with all members marked as absent
            const initialRecords: AttendanceRecord = {};
            clubMembers.forEach(member => {
                initialRecords[member.id] = 'absent';
            });
            setCurrentAttendance(initialRecords);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClubId, selectedDate, attendanceRecords, clubMembers]);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setCurrentAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = () => {
        if (!selectedClubId) {
            alert('Please select a club.');
            return;
        }
        saveAttendance({
            clubId: selectedClubId,
            date: selectedDate,
            records: currentAttendance
        });
        alert('Attendance saved successfully!');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Track Attendance</h2>

            <div className="bg-white shadow-md rounded-lg p-6 space-y-4 md:flex md:items-center md:justify-between md:space-y-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
                    <div>
                        <label htmlFor="club-select" className="block text-sm font-medium text-slate-700">Select Club</label>
                        <select
                            id="club-select"
                            value={selectedClubId}
                            onChange={e => setSelectedClubId(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value="" disabled>-- Select a Club --</option>
                            {clubs.map(club => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date-select" className="block text-sm font-medium text-slate-700">Select Date</label>
                        <input
                            id="date-select"
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full md:w-auto mt-4 md:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                    Save Attendance
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                           {clubMembers.length > 0 ? clubMembers.map(student => {
                                const status = currentAttendance[student.id] || 'absent';
                                return (
                                <tr key={student.id} className={`${statusColors[status] || ''} transition-colors duration-300 border-l-4`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={student.photoUrl} alt={student.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{student.name}</div>
                                                <div className="text-sm text-slate-500">{student.grade}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-2">
                                            {(['present', 'absent', 'late'] as AttendanceStatus[]).map(s => (
                                                <button key={s} onClick={() => handleStatusChange(student.id, s)} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 ${status === s ? statusButtonColors[s].active : statusButtonColors[s].inactive}`}>
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            )}) : (
                                <tr>
                                    <td colSpan={2} className="text-center py-10 text-slate-500">
                                        {selectedClubId ? 'No members in this club.' : 'Please select a club to see members.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTracking;
