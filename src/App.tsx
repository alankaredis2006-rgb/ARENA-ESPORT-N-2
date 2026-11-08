import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { FlashBroadcast } from './components/FlashBroadcast';
import { BottomTaskbar } from './components/BottomTaskbar';
import { HomeView } from './components/HomeView';
import { TournamentsView } from './components/TournamentsView';
import { TeamsView } from './components/TeamsView';
import { CommunityView } from './components/CommunityView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { AdminHubView } from './components/AdminHubView';
import { RoomDetailModal } from './components/RoomDetailModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { CreateTournamentModal } from './components/CreateTournamentModal';
import { P2PTransferModal } from './components/P2PTransferModal';
import { WithdrawModal } from './components/WithdrawModal';
import { SupabaseDocsModal } from './components/SupabaseDocsModal';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const {
    activeTab,
    selectedRoom,
    setSelectedRoom,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#060913] text-slate-900 dark:text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200 transition-colors">
      
      {/* Background ambient liquid aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400/15 via-purple-400/15 to-transparent dark:from-cyan-600/10 dark:via-purple-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-gradient-to-bl from-blue-400/15 via-indigo-400/15 to-transparent dark:from-blue-600/10 dark:via-indigo-600/10 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-10 left-1/4 w-[700px] h-[500px] bg-gradient-to-t from-cyan-400/10 via-purple-400/10 to-transparent dark:from-cyan-900/10 dark:via-purple-900/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Top Header Bar */}
      <Header />

      {/* Flash Notice Bar */}
      <FlashBroadcast />

      {/* Main View Area (with generous bottom padding pb-32 to clear the floating taskbar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 relative z-10 pb-32">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'tournaments' && <TournamentsView />}
        {activeTab === 'teams' && <TeamsView />}
        {activeTab === 'wallet' && <ProfileView />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <AdminHubView />}
      </main>

      {/* Floating Bottom Taskbar */}
      <BottomTaskbar />

      {/* Modals */}
      {selectedRoom && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
      <PaymentGatewayModal />
      <CreateTournamentModal />
      <P2PTransferModal />
      <WithdrawModal />
      <SupabaseDocsModal />
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
