import React from 'react';
import { Lock, Phone, Mail } from 'lucide-react';

const BlockingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-600 text-white p-6 text-center animate-in fade-in duration-500">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-2xl border border-white/20">
        <Lock className="w-24 h-24 mx-auto mb-6 text-red-100" />
        <h1 className="text-4xl font-extrabold mb-4">انتهت الفترة التجريبية</h1>
        <p className="text-xl mb-8 leading-relaxed text-red-100">
          نأسف، لقد انتهت فترة الـ 15 يوماً التجريبية الخاصة بك. <br />
          للمتابعة واستخدام النظام، يرجى تفعيل اشتراكك.
        </p>

        <div className="bg-white text-red-900 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4">تواصل عبر واتساب للتفعيل</h3>
          <div className="flex flex-col gap-4 items-center">
            <a 
              href="https://wa.me/967781414133" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold transition-transform hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              00967781414133
            </a>
            <a 
              href="mailto:kamalalkhtabi@gmail.com" 
              className="flex items-center gap-3 text-gray-600 hover:text-red-800 font-semibold"
            >
              <Mail className="w-5 h-5" />
              kamalalkhtabi@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockingScreen;
