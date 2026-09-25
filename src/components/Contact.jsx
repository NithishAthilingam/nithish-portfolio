import React, { useState } from 'react';
import { Mail, Copy, Check, Send, Phone, MapPin, Shield } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Contact() {
  const { personal, socials } = portfolioData;
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(personal.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 border-t border-slate-800/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            Get In Touch
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Let's connect & collaborate
          </p>
          <p className="text-sm text-slate-400 mt-3">
            Have an engineering inquiry, collaboration, or opportunity? Drop me a line below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Direct Contact info card */}
          <div className="md:col-span-5 p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Contact Information</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Based in Columbus, OH. Open to discussing systems development, defense technology, and cloud infrastructure.
            </p>

            <div className="space-y-4 pt-2">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Email
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-xs sm:text-sm font-medium text-slate-200 truncate mr-2">
                    {personal.email}
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {copiedEmail && (
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copied email to clipboard!
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Phone
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-xs sm:text-sm font-medium text-slate-200 truncate mr-2">
                    {personal.phone}
                  </span>
                  <button
                    onClick={handleCopyPhone}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
                    title="Copy Phone"
                  >
                    {copiedPhone ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {copiedPhone && (
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copied phone to clipboard!
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              <a
                href={`mailto:${personal.email}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                Email Directly
              </a>
              <a
                href={`tel:6143521004`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                Call (614) 352-1004
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
            {formSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white">Thank you!</h4>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Your message has been received. I will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="text-xs text-blue-400 hover:underline pt-2 inline-block"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hello Nithish! I'd like to discuss..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
