'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { Mail, Lock, User, Building } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setCredentials = useAuthStore((state: any) => state.setCredentials);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        organizationName: orgName,
      });
      const { accessToken, refreshToken, user } = response.data;
      
      setCredentials(accessToken, refreshToken, user); 
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] mb-12">
      {/* Left Panel - Deep Blue Gradient */}
      <div className="md:w-1/2 p-12 text-white relative overflow-hidden flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, #0A4BD4 0%, #031B5B 100%)' }}>
        {/* Diagonal Background Lines Simulation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center space-x-3 mb-auto">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center relative">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-wide">YOUR<br/><span className="text-blue-200">LOGO</span></span>
          </div>

          <div className="my-16">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">Join us,<br/>today!</h1>
            <p className="text-blue-100 max-w-sm mb-10 text-sm opacity-90 leading-relaxed font-light">
              Create an account to set up your organization and gain full access to our powerful Business OS suite.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="md:w-1/2 p-12 bg-[#F8FAFC] flex flex-col justify-center relative">
        <form onSubmit={handleRegister} className="w-full max-w-sm mx-auto space-y-4">
          {error && <div className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded-lg">{error}</div>}
          
          <div className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="p-2 bg-blue-100 rounded-lg"><User className="h-4 w-4 text-blue-500" /></div>
              </div>
              <input type="text" required className="w-full pl-16 pr-4 py-3.5 border-none rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm placeholder-gray-400 font-medium" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="p-2 bg-blue-100 rounded-lg"><Mail className="h-4 w-4 text-blue-500" /></div>
              </div>
              <input type="email" required className="w-full pl-16 pr-4 py-3.5 border-none rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm placeholder-gray-400 font-medium" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="p-2 bg-blue-100 rounded-lg"><Lock className="h-4 w-4 text-blue-500" /></div>
              </div>
              <input type="password" required className="w-full pl-16 pr-4 py-3.5 border-none rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm placeholder-gray-400 font-medium" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* Org Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="p-2 bg-blue-100 rounded-lg"><Building className="h-4 w-4 text-blue-500" /></div>
              </div>
              <input type="text" required className="w-full pl-16 pr-4 py-3.5 border-none rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm placeholder-gray-400 font-medium" placeholder="Organization Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-4 mt-6 rounded-xl shadow-md text-sm font-bold text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
            {loading ? 'Registering...' : 'Create Account'}
          </button>

          <div className="mt-8 pt-6 text-center text-xs font-semibold text-gray-500 border-t border-gray-200">
            <p className="mb-4">Already have an account?</p>
            <button type="button" onClick={() => router.push('/login')} className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-sm font-bold text-white focus:outline-none transition-all" style={{ background: 'linear-gradient(90deg, #031B5B 0%, #0A4BD4 100%)' }}>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
