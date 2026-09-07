import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "../types";
import { initialUser } from "../data/mockData";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasCreatedProfile: boolean;
  isCreateProfileModalOpen: boolean;
  setIsCreateProfileModalOpen: (open: boolean) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, grade: string, school: string) => Promise<boolean>;
  googleLogin: () => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => Promise<void>;
  createProfile: (profileData: Partial<User>) => Promise<void>;
  resetProfileOnboarding: () => void;
  loginAdmin: (password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to generate a default student profile template for any authenticated user
function createDefaultStudentProfile(
  id: string,
  name: string,
  email: string,
  avatar?: string,
  grade?: string,
  school?: string
): User {
  return {
    ...initialUser,
    id,
    name: name || "Student Scholar",
    email: email || "student@learningpoint.edu",
    avatar:
      avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    grade: grade || "Class 9 (Secondary Foundation - Rationalized NCERT)",
    school: school || "Secondary School / Academy",
    board: "CBSE",
    aim: "Master Core Syllabus & Score 98%+",
    stream: "Science, Mathematics & Social Science",
    targetExam: "Annual Examinations 2026",
    targetYear: "2026",
    dreamCollege: "Top STEM Senior Secondary School",
    targetScore: "98%+",
    city: "New Delhi",
    bio: "Dedicated student tracking daily goals, revision notes, and exam readiness.",
    preferredLanguage: "English",
    accentColor: "indigo",
    subjects: ["Science", "Mathematics", "Social Science", "English", "Hindi", "Information Technology"],
    weakTopics: [],
    strongTopics: [],
    targetDailyMinutes: 120,
    streak: 1,
    xp: 150,
    level: 1,
    role: "student",
    joinedAt: new Date().toISOString().split("T")[0],
    lastLoginAt: new Date().toISOString(),
    studyGoals: ["Complete today's revision target", "Practice 10 mock questions"],
    examDates: {},
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("ai_study_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // CRITICAL: Clean up any old sessions that accidentally held Ranjit Jha or outdated mock credentials
        if (
          parsed.name === "Ranjit Jha" ||
          parsed.email === "ranjitjha6767@gmail.com" ||
          parsed.email === "alex.morgan@student.edu"
        ) {
          localStorage.removeItem("ai_study_user");
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [hasCreatedProfile, setHasCreatedProfile] = useState<boolean>(() => {
    return localStorage.getItem("ai_study_profile_created") === "true";
  });

  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState<boolean>(false);

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("ai_study_admin_auth") === "true";
  });

  // Sync state to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem("ai_study_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ai_study_user");
    }
  }, [user]);

  const createProfile = async (profileData: Partial<User>) => {
    const userId = user?.id || `user_student_${Date.now()}`;
    const newUser: User = {
      ...(user || createDefaultStudentProfile(userId, profileData.name || "Student Scholar", profileData.email || "")),
      ...profileData,
      id: userId,
      lastLoginAt: new Date().toISOString(),
    };
    setUser(newUser);
    setHasCreatedProfile(true);
    localStorage.setItem("ai_study_profile_created", "true");
    setIsCreateProfileModalOpen(false);
  };

  const resetProfileOnboarding = () => {
    localStorage.removeItem("ai_study_profile_created");
    setHasCreatedProfile(false);
    setIsCreateProfileModalOpen(true);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const localId = `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const fallbackName = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Student";
    const newUser = createDefaultStudentProfile(localId, fallbackName, email);
    setUser(newUser);
    setHasCreatedProfile(true);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    pass: string,
    grade: string,
    school: string
  ): Promise<boolean> => {
    const localId = `user_${Date.now()}`;
    const newProfile = createDefaultStudentProfile(localId, name, email, undefined, grade, school);
    setUser(newProfile);
    setHasCreatedProfile(true);
    return true;
  };

  const googleLogin = async (): Promise<boolean> => {
    const localId = `user_google_${Date.now()}`;
    const profile = createDefaultStudentProfile(
      localId,
      "Google Student",
      "google.student@learningpoint.edu",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    );
    setUser(profile);
    setHasCreatedProfile(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("ai_study_user");
    localStorage.removeItem("ai_study_admin_auth");
  };

  const updateProfile = async (updated: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem("ai_study_user", JSON.stringify(merged));
  };

  const loginAdmin = async (password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    if (password === "847230") {
      setIsAdmin(true);
      localStorage.setItem("ai_study_admin_auth", "true");
      return { success: true };
    }
    return { success: false, message: "Invalid Admin Security Password (code: 847230)" };
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem("ai_study_admin_auth");
  };

  const resetPassword = async (email: string) => {
    await new Promise((r) => setTimeout(r, 400));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        hasCreatedProfile,
        isCreateProfileModalOpen,
        setIsCreateProfileModalOpen,
        login,
        signup,
        googleLogin,
        logout,
        updateProfile,
        createProfile,
        resetProfileOnboarding,
        loginAdmin,
        logoutAdmin,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

