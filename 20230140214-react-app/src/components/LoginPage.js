import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      // Decode role dari JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('role', payload.role);

      navigate('/dashboard');

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-[600px] h-[600px] bg-blue-500/20 blur-3xl rounded-full absolute -top-20 -left-20"></div>
        <div className="w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full absolute bottom-0 right-0"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="text-white text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white text-lg font-semibold shadow-lg"
          >
            Login
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
