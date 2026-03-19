import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Info } from 'lucide-react';

interface ThankYouProps {
  onBack: () => void;
}

export default function ThankYou({ onBack }: ThankYouProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-white py-16 px-4 flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black text-red-600 mb-4 tracking-tight uppercase">
          ĐÃ GỬI EMAIL!
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium">
          Hãy làm theo hướng dẫn bên dưới để nhận bảng tính.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-16 px-4">
        {/* Step 1 */}
        <div className="flex flex-col items-center group">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden w-full aspect-[9/16] transition-transform duration-300 group-hover:-translate-y-2 mb-6">
            <img 
              src="https://i.postimg.cc/wMLdwmwv/1.png" 
              alt="Bước 1" 
              className="w-full h-full object-contain object-top"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-slate-900 font-black text-center text-lg uppercase tracking-tight">KIỂM TRA HỘP THƯ INBOX (CHÍNH)</p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center group">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden w-full aspect-[9/16] transition-transform duration-300 group-hover:-translate-y-2 mb-6">
            <img 
              src="https://i.postimg.cc/D0LKxXxv/2.png" 
              alt="Bước 2" 
              className="w-full h-full object-contain object-top"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-slate-900 font-black text-center text-lg uppercase tracking-tight">KIỂM TRA THƯ RÁC (SPAM)</p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center group">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden w-full aspect-[9/16] transition-transform duration-300 group-hover:-translate-y-2 mb-6">
            <img 
              src="https://i.postimg.cc/L5LMx1x8/3.png" 
              alt="Bước 3" 
              className="w-full h-full object-contain object-top"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-slate-900 font-black text-center text-lg uppercase tracking-tight">BẤM "NOT SPAM" ĐỂ NHẬN TÀI LIỆU</p>
        </div>
      </div>

      {/* Checklist Box */}
      <div className="w-full max-w-3xl bg-[#fffbeb] border-2 border-dashed border-[#fde68a] rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white rounded-full p-1 shadow-sm">
            <CheckCircle2 className="text-[#d97706] size-6" />
          </div>
          <h3 className="text-[#d97706] font-bold text-2xl">Checklist quan trọng:</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="bg-emerald-500 rounded-full p-0.5 shrink-0">
              <CheckCircle2 className="text-white size-4" />
            </div>
            <p className="text-slate-800 font-semibold text-lg">Kiểm tra Inbox hoặc tab Promotions (Quảng cáo).</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="bg-emerald-500 rounded-full p-0.5 shrink-0">
              <CheckCircle2 className="text-white size-4" />
            </div>
            <p className="text-slate-800 font-semibold text-lg">Nếu không thấy, kiểm tra Spam (Thư rác).</p>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-red-500 rounded-full p-1 mt-1 shrink-0">
              <Info className="text-white size-4" />
            </div>
            <p className="text-slate-800 font-semibold text-lg leading-relaxed">
              <strong className="text-red-600 font-black uppercase text-xs block mb-1">QUAN TRỌNG:</strong> Nếu mail nằm trong Spam, hãy mở email và bấm <strong className="text-red-600">"Báo không phải thư rác"</strong> để nhận tài liệu.
            </p>
          </div>
        </div>
      </div>

      <p className="mb-10 text-center text-slate-400 text-sm italic font-medium">
        * Email có thể mất 30s để đến hộp thư của bạn.
      </p>

      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 px-12 py-4 bg-[#0f172a] text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl active:scale-95"
      >
        ← Quay lại trang chính
      </button>
    </motion.div>
  );
}
