import { Lock, User, AlertCircle, ShieldAlert } from 'lucide-react';

interface LoginFormProps {
  username: string;
  password: string;
  error: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  username,
  password,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit
}: LoginFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2">QubitGyan Admin</h1>
            <p className="text-blue-100 text-sm">Secure Gateway for Staff Only</p>
          </div>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-6">
          
          {error && (
            <div className={`p-3 rounded-lg text-sm flex items-start gap-2 border ${
              error.includes("Restricted") 
                ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-red-50 text-red-600 border-red-100"
            }`}>
              {error.includes("Restricted") ? (
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-700"
                required
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-700"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
