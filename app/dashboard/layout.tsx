'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { BookOpen, BarChart3, History, User, LogOut, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profileDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data());
        }
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="glass-effect border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-primary-600 font-poppins">EduGlow</span>
            </Link>

            <div className="flex items-center space-x-1">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg hover:bg-white/50 transition-all duration-300 flex items-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Quizzes</span>
              </Link>
              <Link
                href="/dashboard/progress"
                className="px-4 py-2 rounded-lg hover:bg-white/50 transition-all duration-300 flex items-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Progress</span>
              </Link>
              <Link
                href="/dashboard/history"
                className="px-4 py-2 rounded-lg hover:bg-white/50 transition-all duration-300 flex items-center space-x-2"
              >
                <History className="w-5 h-5" />
                <span>History</span>
              </Link>
              <Link
                href="/dashboard/profile"
                className="px-4 py-2 rounded-lg hover:bg-white/50 transition-all duration-300 flex items-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-all duration-300 flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {userProfile && (
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userProfile.displayName}! 👋
            </h1>
            <p className="text-gray-600">
              {userProfile.grade} • {userProfile.subjectsOfInterest?.join(', ')}
            </p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
