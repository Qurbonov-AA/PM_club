
import React from 'react';
import type { Page, User } from '../types';
import { ChartPieIcon, UsersIcon, CubeIcon, ClipboardCheckIcon, ShieldCheckIcon, LogoutIcon, BookmarkIcon } from './icons';

interface HeaderProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  currentUser: User;
  onLogout: () => void;
}

const NavLink: React.FC<{
  pageName: Page;
  currentPage: Page;
  setPage: (page: Page) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ pageName, currentPage, setPage, icon, children }) => {
  const isActive = currentPage === pageName;
  return (
    <button
      onClick={() => setPage(pageName)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-slate-900 text-white'
          : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
      }`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentPage, setPage, currentUser, onLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-800">ClubTrack</h1>
            <nav className="hidden md:flex md:space-x-4 ml-10">
              <NavLink pageName="dashboard" currentPage={currentPage} setPage={setPage} icon={<ChartPieIcon />}>Dashboard</NavLink>
              <NavLink pageName="students" currentPage={currentPage} setPage={setPage} icon={<UsersIcon />}>Students</NavLink>
              <NavLink pageName="clubs" currentPage={currentPage} setPage={setPage} icon={<CubeIcon />}>Clubs</NavLink>
              <NavLink pageName="attendance" currentPage={currentPage} setPage={setPage} icon={<ClipboardCheckIcon />}>Attendance</NavLink>
              <NavLink pageName="classes" currentPage={currentPage} setPage={setPage} icon={<BookmarkIcon />}>Classes</NavLink>
              {currentUser.role === 'admin' && (
                  <NavLink pageName="teachers" currentPage={currentPage} setPage={setPage} icon={<ShieldCheckIcon />}>Teachers</NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 hidden sm:block">Welcome, <span className="font-medium">{currentUser.name}</span></span>
              <button onClick={onLogout} className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors duration-200">
                  <LogoutIcon />
                  <span className="hidden sm:inline">Logout</span>
              </button>
          </div>
        </div>
      </div>
      {/* Mobile Nav */}
      <nav className="md:hidden bg-white border-t border-slate-200 p-2 flex justify-around">
          <NavLink pageName="dashboard" currentPage={currentPage} setPage={setPage} icon={<ChartPieIcon />}>Dashboard</NavLink>
          <NavLink pageName="students" currentPage={currentPage} setPage={setPage} icon={<UsersIcon />}>Students</NavLink>
          <NavLink pageName="clubs" currentPage={currentPage} setPage={setPage} icon={<CubeIcon />}>Clubs</NavLink>
          <NavLink pageName="attendance" currentPage={currentPage} setPage={setPage} icon={<ClipboardCheckIcon />}>Attendance</NavLink>
          <NavLink pageName="classes" currentPage={currentPage} setPage={setPage} icon={<BookmarkIcon />}>Classes</NavLink>
          {currentUser.role === 'admin' && (
             <NavLink pageName="teachers" currentPage={currentPage} setPage={setPage} icon={<ShieldCheckIcon />}>Teachers</NavLink>
          )}
      </nav>
    </header>
  );
};

export default Header;
