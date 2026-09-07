import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { StudyProvider, useStudy } from "./context/StudyContext";
import { Header } from "./components/navigation/Header";
import { Sidebar } from "./components/navigation/Sidebar";
import { BottomNav } from "./components/navigation/BottomNav";
import { FloatingActionMenu } from "./components/navigation/FloatingActionMenu";
import { ToastContainer } from "./components/common/ToastContainer";
import { AuthModal } from "./components/auth/AuthModal";
import { AdminLoginModal } from "./components/admin/AdminLoginModal";
import { CreateProfileModal } from "./components/profile/CreateProfileModal";

// Main Views
import { MainDashboard } from "./components/dashboard/MainDashboard";
import { AITutorChat } from "./components/ai-tutor/AITutorChat";
import { SubjectsList } from "./components/subjects/SubjectsList";
import { SubjectDetail } from "./components/subjects/SubjectDetail";
import { NotesEditor } from "./components/notes/NotesEditor";
import { NotesAnalyzer } from "./components/notes-analyzer/NotesAnalyzer";
import { SummaryGenerator } from "./components/summary-generator/SummaryGenerator";
import { ExplanationEngine } from "./components/explanation-engine/ExplanationEngine";
import { QuestionGenerator } from "./components/question-generator/QuestionGenerator";
import { MathSolver } from "./components/math-solver/MathSolver";
import { QuestionScanner } from "./components/question-scanner/QuestionScanner";
import { FlashcardDeck } from "./components/flashcards/FlashcardDeck";
import { PracticeMistakesView } from "./components/practice/PracticeMistakesView";
import { QuizList } from "./components/quiz/QuizList";
import { ActiveQuizRunner } from "./components/quiz/ActiveQuizRunner";
import { QuizResultView } from "./components/quiz/QuizResultView";
import { StudyPlanner } from "./components/planner/StudyPlanner";
import { FocusTimer } from "./components/focus-timer/FocusTimer";
import { AnalyticsDashboard } from "./components/analytics/AnalyticsDashboard";
import { GoalsView } from "./components/goals/GoalsView";
import { ExamCenter } from "./components/exam-center/ExamCenter";
import { DigitalLibrary } from "./components/digital-library/DigitalLibrary";
import { NotificationsView } from "./components/notifications/NotificationsView";
import { AchievementsView } from "./components/achievements/AchievementsView";
import { SettingsView } from "./components/settings/SettingsView";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ProfileView } from "./components/profile/ProfileView";
import { SyllabusView } from "./components/syllabus/SyllabusView";
import { TestCenterView } from "./components/tests/TestCenterView";
import { ScholarVideosHub } from "./components/videos/ScholarVideosHub";
import { ScholarShortsView } from "./components/videos/ScholarShortsView";
import { SmartNotesView } from "./components/smart-notes/SmartNotesView";
import { StudyAlarmsView } from "./components/alarms/StudyAlarmsView";
import { ActiveAlarmRingingModal } from "./components/alarms/ActiveAlarmRingingModal";
import { PWAInstallModal } from "./components/pwa/PWAInstallModal";
import { usePWAInstall } from "./hooks/usePWAInstall";

const MainAppContent: React.FC = () => {
  const { currentView } = useStudy();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const {
    canPrompt,
    isIOS,
    isInstalled,
    showAutoPrompt,
    setShowAutoPrompt,
    triggerInstall,
    dismissPrompt,
  } = usePWAInstall();

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <MainDashboard />;
      case "profile":
        return <ProfileView />;
      case "syllabus":
        return <SyllabusView />;
      case "smart-notes":
        return <SmartNotesView />;
      case "study-alarms":
        return <StudyAlarmsView onOpenPwaModal={() => setShowAutoPrompt(true)} />;
      case "tests":
        return <TestCenterView />;
      case "video-lectures":
      case "scholar-videos":
        return <ScholarVideosHub />;
      case "scholar-shorts":
        return <ScholarShortsView />;
      case "saved-videos":
        return <ScholarVideosHub initialTab="saved" />;
      case "ai-tutor":
        return <AITutorChat />;
      case "subjects":
        return <SubjectsList />;
      case "subject-detail":
        return <SubjectDetail />;
      case "notes":
        return <NotesEditor />;
      case "notes-analyzer":
        return <NotesAnalyzer />;
      case "summary-generator":
        return <SummaryGenerator />;
      case "explanation-engine":
        return <ExplanationEngine />;
      case "question-generator":
        return <QuestionGenerator />;
      case "math-solver":
        return <MathSolver />;
      case "question-scanner":
        return <QuestionScanner />;
      case "flashcards":
        return <FlashcardDeck />;
      case "practice":
      case "mistake-notebook":
        return <PracticeMistakesView />;
      case "quizzes":
        return <QuizList />;
      case "active-quiz":
        return <ActiveQuizRunner />;
      case "quiz-result":
        return <QuizResultView />;
      case "planner":
        return <StudyPlanner />;
      case "focus-timer":
        return <FocusTimer />;
      case "progress":
        return <AnalyticsDashboard />;
      case "goals":
        return <GoalsView />;
      case "exams":
        return <ExamCenter />;
      case "library":
        return <DigitalLibrary />;
      case "notifications":
        return <NotificationsView />;
      case "achievements":
        return <AchievementsView />;
      case "settings":
        return <SettingsView />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Fixed Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <Header
          onToggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12 animate-in fade-in duration-200">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Quick Action Floating Menu */}
      <FloatingActionMenu />

      {/* Global Interactive Notification Toasts */}
      <ToastContainer />

      {/* Modals & Alarm Alert */}
      <ActiveAlarmRingingModal />
      <CreateProfileModal />
      <PWAInstallModal
        isOpen={showAutoPrompt}
        onClose={dismissPrompt}
        onInstall={triggerInstall}
        canPrompt={canPrompt}
        isIOS={isIOS}
        isInstalled={isInstalled}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StudyProvider>
        <MainAppContent />
      </StudyProvider>
    </AuthProvider>
  );
}
