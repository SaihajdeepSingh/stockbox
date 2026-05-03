import { useState } from 'react';
import { Send, CheckCircle2, Mail, MessageSquare, Clock, HeadphonesIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

const TOPICS = ['General Enquiry','Technical Issue','Trading Problem','Account & Password','Feature Request','Feedback','Other'];

interface FormState {
  firstName: string; lastName: string; email: string;
  phone: string; subject: string; message: string; newsletter: boolean;
}
const EMPTY: FormState = { firstName:'', lastName:'', email:'', phone:'', subject: TOPICS[0], message:'', newsletter: false };

export default function Support() {
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [loading, setLoading]   = useState(false);
  const [submitted,setSubmitted]= useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSubmitted(true);
      toast.success("Message sent! We'll reply within 24 hours.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#060d3a] overflow-hidden"
        style={{ backgroundImage:'linear-gradient(rgba(59,130,246,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.06) 1px,transparent 1px)', backgroundSize:'48px 48px' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-28 pb-14 lg:pt-36 lg:pb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-blue-300 mb-6">
            <HeadphonesIcon className="w-3.5 h-3.5" /> Support Centre
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            How can we<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">help you?</span>
          </h1>
          <p className="text-blue-100/60 text-lg leading-relaxed max-w-lg">
            Found a bug, stuck on setup, or have a feature idea? We read every message and reply fast.
          </p>

          {/* Channel cards inside hero */}
          <div className="grid sm:grid-cols-3 gap-3 mt-10">
            {[
              { icon: Mail,          label: 'Email',        val: 'support@stockbox.in', note: 'Detailed issues' },
              { icon: MessageSquare, label: 'Live Chat',    val: 'Inside dashboard',    note: 'Fastest reply'   },
              { icon: Clock,         label: 'Response',     val: 'Within 24 hours',     note: 'Mon to Sat'      },
            ].map(({ icon: Icon, label, val, note }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-blue-400/30 hover:bg-white/8 transition-all">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3 shadow-md shadow-blue-900/40">
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-0.5">{label}</p>
                <p className="text-white font-bold text-xs leading-snug mb-0.5">{val}</p>
                <p className="text-slate-600 text-[10px]">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Centered form */}
      <section className="flex-1 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Message received!</h2>
              <p className="text-slate-500 max-w-xs mx-auto mb-8 text-sm leading-relaxed">
                We'll reply to <strong className="text-slate-700">{form.email}</strong> within 24 hours.
              </p>
              <button onClick={() => { setForm(EMPTY); setSubmitted(false); }}
                className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 font-bold rounded-xl px-6 py-2.5 text-sm hover:bg-blue-600 hover:text-white transition-all">
                Send another message
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900">Send us a message</h2>
                <p className="text-slate-400 text-sm mt-0.5">Fields marked * are required.</p>
              </div>
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">First Name *</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="Priya"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Mehta"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Topic *</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    {TOPICS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required minLength={10} rows={5}
                    placeholder="Describe your issue or question in detail..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-blue-600 rounded flex-shrink-0" />
                  <span className="text-sm text-slate-500 leading-relaxed">
                    Subscribe to StockBox product updates and market tips newsletter.
                  </span>
                </label>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl py-3.5 text-sm transition-all shadow-lg shadow-blue-100 hover:-translate-y-px">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    : <><Send className="w-4 h-4" /> Send Message</>
                  }
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
