import React from 'react';
import { Lock, Phone, Mail, AlertTriangle } from 'lucide-react';

const BlockingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-700 text-white p-6 text-center animate-in zoom-in duration-500">
      <div className="bg-white/10 backdrop-blur-lg p-12 rounded-3xl shadow-2xl max-w-2xl w-full border border-white/20">
        <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Lock className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl font-black mb-4 tracking-tight">انتهت الفترة التجريبية</h1>
        <div className="bg-red-800/50 p-4 rounded-xl mb-8 border border-red-500/30">
            <p className="text-xl leading-relaxed text-red-50 font-medium flex flex-col gap-2">
            <span className="flex items-center justify-center gap-2"><AlertTriangle className="w-5 h-5"/> تنبيه</span>
            نأسف، لقد انتهت فترة الـ 15 يوماً التجريبية الخاصة بك.
            <br />
            <span className="text-sm opacity-80">للمتابعة واستخدام النظام، يرجى تفعيل اشتراكك.</span>
            </p>
        </div>

        <div className="bg-white text-red-900 p-8 rounded-2xl shadow-xl">
          <h3 className="font-bold text-xl mb-6 text-gray-800">تواصل معنا فوراً للتفعيل</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://wa.me/967781414133" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 w-full sm:w-auto"
            >
              <Phone className="w-5 h-5" />
              واتساب: 7781414133
            </a>
            <a 
              href="mailto:kamalalkhtabi@gmail.com" 
              className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold transition-all hover:shadow-md w-full sm:w-auto"
            >
              <Mail className="w-5 h-5" />
              مراسلة عبر الإيميل
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockingScreen;