'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setCredentials = useAuthStore((state: any) => state.setCredentials);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { accessToken } = response.data;
      
      setCredentials(accessToken, { email }, null); 
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">Hello,<br/>welcome!</h1>
            <p className="text-blue-100 max-w-sm mb-10 text-sm opacity-90 leading-relaxed font-light">
              Log in to the Business OS. Start tracking your deals, managing your contacts, and scaling your organization securely.
            </p>
            <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition shadow-lg w-fit">
              View more
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="md:w-1/2 p-12 bg-[#F8FAFC] flex flex-col justify-center relative">
        <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto space-y-6">
          {error && <div className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded-lg">{error}</div>}
          
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <input
                type="email"
                required
                className="w-full pl-16 pr-4 py-4 border-none rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm placeholder-gray-400 font-medium"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lock className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <input
                type="password"
                required
                className="w-full pl-16 pr-4 py-4 border-none rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm placeholder-gray-400 font-medium"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-gray-500 cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-xs font-semibold">
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 mt-8 rounded-xl shadow-md text-sm font-bold text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="mt-12 pt-8 text-center text-xs font-semibold text-gray-500 border-t border-gray-200">
            <p className="mb-4">Not a member yet?</p>
            <button 
              type="button"
              onClick={() => router.push('/register')}
              className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-sm font-bold text-white focus:outline-none transition-all"
              style={{ background: 'linear-gradient(90deg, #031B5B 0%, #0A4BD4 100%)' }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
