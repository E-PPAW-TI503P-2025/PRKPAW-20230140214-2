import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        nama, email, password, role
      });

      alert('Registrasi berhasil!');
      navigate('/login');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Register gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      
      {/* Glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div className="w-[600px] h-[600px] bg-green-500/20 blur-3xl rounded-full absolute -top-10 -left-10"></div>
  <div className="w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full absolute bottom-0 right-0"></div>
</div>


      <div className="relative bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="text-white text-sm font-medium">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                         focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                         focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                         focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white
                         focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 transition rounded-lg text-white text-lg font-semibold shadow-lg"
          >
            Register
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </form>

      </div>
    </div>
  );
}

export default RegisterPage;
