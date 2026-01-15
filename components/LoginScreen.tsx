
import React from 'react';
import { supabase } from '../services/supabaseClient';

interface Props {
  onBack: () => void;
}

const LoginScreen: React.FC<Props> = ({ onBack }) => {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // استخدام window.location.origin يضمن العودة لنفس الرابط الذي يعمل عليه التطبيق حالياً
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error logging in:', error.message);
      alert('حدث خطأ أثناء محاولة تسجيل الدخول: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 fade-in text-center">
        <div className="mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h2>
            <p className="text-gray-600 font-medium">سجل في نظام التقييم لتستمتع بفترة تجريبية لمدة 15 يوم</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl hover:bg-gray-50 transition transform hover:-translate-y-1 shadow-md"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          <span>سجل للمتابعة عبر جوجل</span>
        </button>

        <button 
          onClick={onBack}
          className="mt-6 text-gray-500 hover:text-gray-700 font-semibold text-sm transition"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
