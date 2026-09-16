import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { SubjectCarousel } from './components/SubjectCarousel';
import { SubjectPage } from './components/SubjectPage';
import { PyqSelectPage } from './components/PyqSelectPage';
import { ChapterListPage } from './components/ChapterListPage';
import { LevelsPage } from './components/LevelsPage';
import { AttemptPage } from './components/AttemptPage';
import { ProgressPage } from './components/ProgressPage';
import { ProfilePage } from './components/ProfilePage';
import { BookmarksPage } from './components/BookmarksPage';
import { SettingsPage } from './components/SettingsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { ActionPopup } from './components/ActionPopup';
import { PdfViewerModal } from './components/PdfViewerModal';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  // If in active attempt/exam mode, display the focused full-screen Attempt Page
  if (currentView === 'attempt') {
    return (
      <main className="min-h-screen bg-[#090b20]">
        <AttemptPage />
        <PdfViewerModal />
      </main>
    );
  }

  const isLanding = currentView === 'landing';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans ${
        isLanding
          ? 'bg-[#fafbfd] text-slate-900 selection:bg-blue-600 selection:text-white'
          : 'bg-[#090b20] text-slate-100 selection:bg-cyan-500 selection:text-slate-950'
      }`}
    >
      {/* Top Universal Navbar */}
      <Navbar />

      {/* Main Viewport Routing */}
      <main className="flex-1 w-full relative">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'home' && <SubjectCarousel />}
        {currentView === 'subject' && <SubjectPage />}
        {currentView === 'pyq-select' && <PyqSelectPage />}
        {currentView === 'chapters' && <ChapterListPage />}
        {currentView === 'levels' && <LevelsPage />}
        {currentView === 'progress' && <ProgressPage />}
        {currentView === 'profile' && <ProfilePage />}
        {currentView === 'bookmarks' && <BookmarksPage />}
        {currentView === 'settings' && <SettingsPage />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals & Overlays */}
      <AuthModal />
      <ActionPopup />
      <PdfViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
