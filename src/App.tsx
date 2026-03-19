import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, CheckCircle, AlertCircle, Clock, CreditCard, 
  ChevronRight, BookOpen, Download, Mail, Phone, MapPin,
  XCircle, CheckSquare, ArrowRight, FileCheck, Landmark,
  Menu, X, Facebook
} from 'lucide-react';
import ThankYou from './components/ThankYou';

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    
    const formData = new FormData(e.target as HTMLFormElement);
    const firstname = formData.get('firstname') as string;
    const email = formData.get('email') as string;

    try {
      console.log('Submitting form to local API...');
      
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, email }),
      });

      if (response.ok) {
        console.log('Form submission successful via server proxy');
        setFormState('success');
        (e.target as HTMLFormElement).reset();
        
        // Show thank you page immediately
        setShowThankYou(true);
        
        setTimeout(() => setFormState('idle'), 5000);
      } else {
        const errorData = await response.json();
        console.error('Form submission failed:', errorData.error);
        setFormState('idle');
        alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua số điện thoại.');
      }
    } catch (error) {
      console.error('Network error during form submission:', error);
      setFormState('idle');
      alert('Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  if (showThankYou) {
    return <ThankYou onBack={() => setShowThankYou(false)} />;
  }

  return (
    <div className="min-h-screen relative selection:bg-blue-200 selection:text-blue-900">
      {/* Background decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-100/40 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-heading font-bold text-xl">
              N
            </div>
            <span className="font-heading text-xl text-slate-800">Nguyễn Nam BĐS</span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('van-de')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Vấn đề thường gặp</button>
            <button onClick={() => scrollTo('ho-so')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Hồ sơ cần chuẩn bị</button>
            <button onClick={() => scrollTo('chi-phi')} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Chi phí</button>
            <button onClick={() => scrollTo('form')} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
              <Download size={16} />
              Nhận bộ hồ sơ mẫu
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-[88px] left-4 right-4 glass rounded-2xl p-4 flex flex-col gap-4 shadow-xl"
          >
            <button onClick={() => scrollTo('van-de')} className="text-left px-4 py-3 rounded-lg hover:bg-white/50 font-medium text-slate-700">Vấn đề thường gặp</button>
            <button onClick={() => scrollTo('ho-so')} className="text-left px-4 py-3 rounded-lg hover:bg-white/50 font-medium text-slate-700">Hồ sơ cần chuẩn bị</button>
            <button onClick={() => scrollTo('chi-phi')} className="text-left px-4 py-3 rounded-lg hover:bg-white/50 font-medium text-slate-700">Chi phí</button>
            <button onClick={() => scrollTo('form')} className="btn-primary px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 mt-2">
              <Download size={18} />
              Nhận bộ hồ sơ mẫu
            </button>
          </motion.div>
        )}
      </header>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section className="py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-blue-700 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Hướng dẫn chi tiết thủ tục cấp sổ hồng
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-semibold text-4xl md:text-5xl lg:text-[60px] leading-[1.1] text-slate-900 mb-6"
            >
              Đừng để thiếu 1 giấy tờ mà <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">chậm cấp sổ Vinhomes</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Mình đã hệ thống lại những bước quan trọng nhất khi làm thủ tục cấp sổ: hồ sơ cần chuẩn bị, phân biệt sao y và công chứng, nơi nộp hồ sơ và các khoản phí thường gặp.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button onClick={() => scrollTo('form')} className="w-full sm:w-auto btn-primary px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2">
                <Mail size={20} />
                Nhận checklist qua email
              </button>
              <button onClick={() => scrollTo('quy-trinh')} className="w-full sm:w-auto btn-secondary px-8 py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2">
                Xem quy trình nhanh
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 w-full max-w-lg lg:max-w-none relative"
          >
            <div className="relative z-10 glass rounded-3xl p-6 md:p-8 shadow-2xl border border-white/60 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
                Cập nhật mới nhất
              </div>
              <div className="bg-white/50 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-xl text-slate-800">Bộ Tài Liệu Cấp Sổ</h3>
                    <p className="text-sm text-slate-500">Dành riêng cho cư dân Vinhomes</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    "Checklist 6 loại giấy tờ bắt buộc",
                    "Bảng so sánh Sao y vs Công chứng",
                    "Sơ đồ quy trình 5 bước nộp hồ sơ",
                    "Bảng dự toán các khoản phí"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 bg-white/60 p-3 rounded-xl">
                      <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-slate-600">
                  <span className="text-blue-600 font-bold">500+</span> cư dân đã nhận
                </p>
              </div>
            </div>
            
            {/* Decorative elements behind the mockup */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl -z-10" />
          </motion.div>
        </section>

        {/* Section: Tác giả (Author Info) */}
        <section className="py-12">
          <FadeIn className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            {/* Schema.org JSON-LD */}
            <script 
              type="application/ld+json" 
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "RealEstateAgent",
                "name": "Nguyễn Nam BĐS",
                "jobTitle": "Giám đốc kinh doanh",
                "worksFor": {
                  "@type": "Organization",
                  "name": "Thành Phát Land"
                },
                "description": "Chuyên tư vấn đầu tư bất động sản Vinhomes, Masterise Homes và một số CĐT lớn phía Đông Hà Nội",
                "telephone": "0987.182.666",
                "sameAs": [
                  "https://www.facebook.com/mr.nambdsvn/"
                ]
              }) }} 
            />

            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden shrink-0 bg-slate-200">
              <img src="https://i.postimg.cc/j5nWg8jz/anh_dai_dien.jpg" alt="Nguyễn Nam BĐS" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
                Tác giả tài liệu
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-slate-900 mb-2">Tôi là Nguyễn Nam BĐS</h2>
              <p className="text-lg text-blue-600 font-medium mb-4">Giám đốc kinh doanh tại Thành Phát Land</p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Chuyên tư vấn đầu tư bất động sản Vinhomes, Masterise Homes và một số CĐT lớn phía Đông Hà Nội.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <a href="tel:0987182666" className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-slate-700 hover:text-blue-600 font-medium">
                  <Phone size={18} className="text-blue-500" />
                  0987.182.666
                </a>
                <a href="https://www.facebook.com/mr.nambdsvn/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-slate-700 hover:text-blue-600 font-medium">
                  <Facebook size={18} className="text-blue-500" />
                  Facebook Cá Nhân
                </a>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Section 1: Vướng mắc */}
        <section id="van-de" className="py-20">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-slate-900 mb-4">Những vướng mắc khách thường gặp</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Làm sổ hồng không khó, nhưng rất dễ mất thời gian nếu bạn vướng phải những lỗi cơ bản sau.</p>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Không biết hồ sơ nào bắt buộc", desc: "Mang thiếu giấy tờ, phải đi lại nhiều lần bổ sung." },
              { icon: AlertCircle, title: "Nhầm giữa sao y và công chứng", desc: "Chuẩn bị sai loại bản sao, bị từ chối tiếp nhận hồ sơ." },
              { icon: MapPin, title: "Không rõ đi đâu nộp hồ sơ", desc: "Đến sai cơ quan hành chính, mất thời gian di chuyển." },
              { icon: CreditCard, title: "Không chuẩn bị trước phí", desc: "Bất ngờ với các khoản phí phát sinh không lường trước." },
              { icon: Clock, title: "Bỏ lỡ thông báo", desc: "Không theo dõi email/điện thoại, làm chậm tiến độ nhận sổ." }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} className="glass-card p-6 rounded-2xl h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
                  <item.icon size={24} />
                </div>
                <h3 className="font-heading font-semibold text-lg text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm flex-grow">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Section 2: Hồ sơ cần chuẩn bị */}
        <section id="ho-so" className="py-20">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-slate-900 mb-4">Hồ sơ cần chuẩn bị</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Checklist 6 loại giấy tờ quan trọng nhất bạn cần có trước khi đi nộp.</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Văn bản xác nhận chuyển nhượng HĐMB",
              "Biên bản bàn giao nhà",
              "HĐMB sao y",
              "CCCD / VNeID",
              "Giấy xác nhận tình trạng hôn nhân hoặc ĐKKH",
              "Giấy ủy quyền (nếu có người đi thay)"
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} className="glass-card p-6 rounded-2xl flex items-start gap-4 h-full">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-bold text-sm">{i + 1}</span>
                </div>
                <h3 className="font-heading font-semibold text-slate-800 leading-snug">{item}</h3>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Section 3: Sao y vs Công chứng */}
        <section className="py-20">
          <FadeIn className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            
            <div className="text-center mb-12">
              <h2 className="font-heading font-semibold text-3xl md:text-4xl text-slate-900 mb-4">Sao y và Công chứng khác nhau thế nào?</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Chuẩn bị sai loại giấy tờ là lỗi rất hay gặp khiến hồ sơ bị trả về.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/60 rounded-2xl p-8 border border-white">
                <div className="flex items-center gap-3 mb-6">
                  <FileCheck className="text-blue-600" size={28} />
                  <h3 className="font-heading font-semibold text-2xl text-slate-800">Sao y bản chính</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckSquare className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Là việc chứng thực bản sao đúng với bản chính.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckSquare className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Thực hiện tại UBND Phường/Xã hoặc Phòng Công chứng.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckSquare className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Áp dụng cho: CCCD, Giấy ĐKKH, HĐMB...</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/60 rounded-2xl p-8 border border-white">
                <div className="flex items-center gap-3 mb-6">
                  <Landmark className="text-emerald-600" size={28} />
                  <h3 className="font-heading font-semibold text-2xl text-slate-800">Công chứng</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckSquare className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Là việc chứng nhận tính xác thực, hợp pháp của hợp đồng, giao dịch.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckSquare className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Chỉ thực hiện tại Phòng/Văn phòng Công chứng.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckSquare className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Áp dụng cho: Giấy ủy quyền, Văn bản chuyển nhượng...</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 max-w-4xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-amber-800 font-medium">
                <strong>Lưu ý quan trọng:</strong> Khi nộp hồ sơ làm sổ, cơ quan nhà nước thường yêu cầu bản sao y có thời hạn không quá 6 tháng.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Section 4: Quy trình */}
        <section id="quy-trinh" className="py-20">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-slate-900 mb-4">Quy trình đi nộp thực tế</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">5 bước cơ bản từ lúc bước vào cửa cơ quan hành chính đến khi nhận giấy hẹn.</p>
          </FadeIn>

          <div className="max-w-3xl mx-auto">
            {[
              { title: "Xác định đúng nơi nộp hồ sơ", desc: "Văn phòng Đăng ký đất đai chi nhánh Quận/Huyện hoặc Bộ phận Một cửa." },
              { title: "Đến quầy/lễ tân lấy STT", desc: "Lấy số thứ tự tại máy tự động hoặc quầy hướng dẫn." },
              { title: "Di chuyển tới phòng thủ tục", desc: "Chờ gọi số và đến đúng quầy tiếp nhận hồ sơ đất đai." },
              { title: "Nộp hồ sơ theo hướng dẫn", desc: "Cán bộ kiểm tra, nếu đủ sẽ cấp Giấy tiếp nhận và hẹn trả kết quả." },
              { title: "Theo dõi thông báo", desc: "Nhận thông báo nộp thuế/phí qua tin nhắn, email hoặc điện thoại." }
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} className="relative flex gap-6 pb-12 last:pb-0">
                {/* Timeline line */}
                {i !== 4 && <div className="absolute left-[23px] top-12 bottom-0 w-0.5 bg-blue-200" />}
                
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold z-10 shadow-lg shadow-blue-200">
                  {i + 1}
                </div>
                <div className="glass-card p-6 rounded-2xl flex-1">
                  <h3 className="font-heading font-semibold text-xl text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Section 5: Chi phí */}
        <section id="chi-phi" className="py-20">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-slate-900 mb-4">Các khoản phí cần biết</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Chuẩn bị sẵn tài chính để quá trình nhận sổ diễn ra suôn sẻ.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Phí thẩm định hồ sơ", desc: "Phí cơ quan nhà nước kiểm tra tính pháp lý của hồ sơ.", icon: FileText },
              { title: "Phí tờ bìa (Phí cấp đổi)", desc: "Chi phí in ấn phôi Giấy chứng nhận (Sổ hồng).", icon: BookOpen },
              { title: "Lệ phí trước bạ", desc: "Thường là 0.5% giá trị tài sản (tùy trường hợp cụ thể).", icon: CreditCard }
            ].map((fee, i) => (
              <FadeIn key={i} delay={i * 0.1} className="glass-card p-8 rounded-2xl text-center h-full flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 flex items-center justify-center mb-6">
                  <fee.icon size={32} />
                </div>
                <h3 className="font-heading font-semibold text-xl text-slate-800 mb-3">{fee.title}</h3>
                <p className="text-slate-600 text-sm">{fee.desc}</p>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Section 6: Form */}
        <section id="form" className="py-20">
          <FadeIn className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-400" />
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading font-semibold text-3xl md:text-4xl text-slate-900 mb-4">Nhận trọn bộ tài liệu hướng dẫn</h2>
                <p className="text-slate-600 mb-8">
                  Để lại thông tin, mình sẽ gửi ngay vào email của bạn:
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="text-blue-500" size={20} />
                    <span>Checklist hồ sơ chi tiết (PDF)</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="text-blue-500" size={20} />
                    <span>Mẫu đơn từ cần thiết (Word)</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="text-blue-500" size={20} />
                    <span>Bảng tính dự trù chi phí (Excel)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 md:p-8 shadow-lg">
                {formState === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-heading font-semibold text-slate-800 mb-2">Đăng ký thành công!</h3>
                    <p className="text-slate-600">
                      Tài liệu đã được gửi đến email của bạn. Vui lòng kiểm tra cả hộp thư <strong>Spam (Thư rác)</strong> nếu không thấy trong hộp thư đến nhé.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Họ và tên *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="firstname"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/50"
                        placeholder="Nhập họ tên của bạn"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/50"
                        placeholder="example@email.com"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={formState === 'loading'}
                      className="w-full btn-primary py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formState === 'loading' ? (
                        <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Mail size={20} />
                          Gửi tôi bộ hồ sơ mẫu
                        </>
                      )}
                    </button>
                    <p className="text-xs text-center text-slate-500 mt-4">
                      Cam kết bảo mật thông tin. Không spam.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </FadeIn>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-heading font-bold">
                N
              </div>
              <span className="font-heading text-xl text-white">Nguyễn Nam BĐS</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md mb-6">
              Chuyên viên tư vấn bất động sản Vinhomes. Đồng hành cùng bạn từ lúc tìm hiểu dự án đến khi cầm sổ hồng trên tay.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Phone size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div className="md:text-right">
            <p className="text-sm text-slate-500 mb-2">
              <strong>Ghi chú:</strong> Thông tin trên website mang tính chất tham khảo. Quy trình và hồ sơ thực tế có thể thay đổi tùy theo quy định của cơ quan nhà nước tại từng thời điểm và từng địa phương.
            </p>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Nguyễn Nam BĐS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
