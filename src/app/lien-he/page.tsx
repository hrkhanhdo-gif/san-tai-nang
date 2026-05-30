'use client';

import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle,
  Globe
} from 'lucide-react';
import { dbHelper } from '@/lib/supabase';

export default function Contact() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dbHelper.sendContactMessage({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      message: form.message
    });

    // Construct the mailto link to open user's local email app
    const subject = encodeURIComponent(`[Săn Tài Năng] Liên hệ từ ${form.fullName}`);
    const body = encodeURIComponent(
      `Họ và tên: ${form.fullName}\n` +
      `Địa chỉ Email: ${form.email}\n` +
      `Số điện thoại: ${form.phone}\n\n` +
      `Nội dung tin nhắn:\n${form.message}`
    );
    
    // Redirect to mailto link
    window.location.href = `mailto:ttg.thuanhn@gmail.com?subject=${subject}&body=${body}`;

    setIsSuccess(true);
    setForm({
      fullName: '',
      email: '',
      phone: '',
      message: ''
    });

    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Intro Banner */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/5 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
            Kết nối với chúng tôi
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mt-6 mb-6">
            Hãy liên hệ với chúng tôi
          </h1>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mb-6" />
          <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến đóng góp, đề xuất hợp tác hoặc yêu cầu hỗ trợ từ bạn.
          </p>
        </div>
      </section>

      {/* Grid details and Form */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details & Map Mockup */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex flex-col space-y-6">
              <h3 className="text-lg font-black text-gray-900 border-b border-[#D4AF37]/20 pb-3">
                Thông tin trực tiếp
              </h3>
              
              <ul className="space-y-4 text-xs font-bold text-gray-700">
                <li className="flex items-start space-x-3.5 p-4 rounded-xl bg-[#FDFBF7] border border-[#D4AF37]/10">
                  <Phone size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase font-extrabold tracking-wider">Số điện thoại liên hệ</span>
                    <a href="tel:+84986162568" className="hover:text-[#D4AF37] transition-colors mt-0.5">
                      +84 98 61 62 568
                    </a>
                  </div>
                </li>

                <li className="flex items-start space-x-3.5 p-4 rounded-xl bg-[#FDFBF7] border border-[#D4AF37]/10">
                  <Mail size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase font-extrabold tracking-wider">Địa chỉ thư điện tử</span>
                    <a href="mailto:ttg.thuanhn@gmail.com" className="hover:text-[#D4AF37] transition-colors break-all mt-0.5">
                      ttg.thuanhn@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start space-x-3.5 p-4 rounded-xl bg-[#FDFBF7] border border-[#D4AF37]/10">
                  <MapPin size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] uppercase font-extrabold tracking-wider">Trụ sở làm việc</span>
                    <span className="mt-0.5 leading-relaxed font-semibold">
                      KDC Lê Thành, Phường An Lạc, Quận Bình Tân, TP. Hồ Chí Minh
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Google Map Mockup (Vàng & Trắng cao cấp) */}
            <div className="rounded-3xl border border-[#D4AF37]/25 overflow-hidden shadow-md">
              <div className="bg-[#FDFBF7] px-5 py-4 border-b border-[#D4AF37]/15 flex items-center space-x-2">
                <Globe size={16} className="text-[#D4AF37]" />
                <span className="text-xs font-black text-gray-800 uppercase tracking-wider">
                  Bản đồ vị trí KDC Lê Thành
                </span>
              </div>
              {/* Premium abstract layout mimicking a clean gold map */}
              <div className="relative aspect-[16/10] bg-white flex flex-col items-center justify-center p-6 text-center">
                {/* Decorative map grids */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-5 pointer-events-none">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="border border-[#D4AF37]" />
                  ))}
                </div>
                
                {/* Map Pins mock */}
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-lg animate-bounce mx-auto">
                    <MapPin size={28} className="stroke-[2.5]" />
                  </div>
                  <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide mt-4">KDC Lê Thành, Bình Tân</h4>
                  <p className="text-[10px] text-gray-500 font-semibold mt-1 max-w-[240px]">
                    Khu dân cư sầm uất kế bên Đại lộ Võ Văn Kiệt, kết nối thuận lợi về khu vực trung tâm TP.HCM.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#FDFBF7] border border-[#D4AF37]/25 shadow-lg relative">
            <h3 className="text-xl font-black text-gray-900 mb-2">Gửi tin nhắn liên hệ</h3>
            <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
              Hãy để lại lời nhắn của bạn bằng biểu mẫu dưới đây. Đội ngũ điều hành Săn Tài Năng sẽ phản hồi thư của bạn chậm nhất trong vòng 12h làm việc.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSuccess ? (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-center flex items-center justify-center space-x-2 font-bold text-sm">
                  <CheckCircle size={18} />
                  <span>Lời nhắn của bạn đã được gửi thành công! Cảm ơn sự quan tâm từ bạn.</span>
                </div>
              ) : (
                <>
                  {/* Name */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Địa chỉ Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0987654321"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>

                  {/* Content Message */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Nội dung tin nhắn *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Nhập nội dung tin nhắn hoặc nhu cầu hợp tác nhân sự của bạn..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md flex items-center justify-center space-x-2"
                  >
                    <Send size={14} />
                    <span>Gửi tin nhắn liên hệ</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
