
import React from 'react';

interface Props {
  onLogout: () => void;
}

const LockScreen: React.FC<Props> = ({ onLogout }) => {
  return (
    <div className="fixed inset-0 bg-red-600 flex items-center justify-center p-6 z-[9999] text-white text-center">
      <div className="max-w-md w-full fade-in">
        <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h1 className="text-4xl font-black mb-4">انتهت الفترة التجريبية</h1>
            <p className="text-xl opacity-90 leading-relaxed mb-10">
                لقد انتهت فترة الـ 15 يوماً المتاحة لك. يرجى التواصل مع الإدارة لتفعيل حسابك والاستمرار في استخدام النظام.
            </p>
        </div>

        <div className="flex flex-col gap-4">
            <a 
                href="https://wa.me/967781414133" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-3"
            >
                <span>تواصل عبر واتساب للتفعيل</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </a>
            <a 
                href="mailto:kamalalkhtabi@gmail.com"
                className="text-white/80 hover:text-white font-medium text-lg underline decoration-white/40"
            >
                kamalalkhtabi@gmail.com
            </a>
            <button 
                onClick={onLogout}
                className="mt-8 text-white/60 hover:text-white font-bold"
            >
                تسجيل الخروج
            </button>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
