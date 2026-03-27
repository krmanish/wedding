import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function WeddingPage() {
  const { slug } = useParams();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'phone' | 'otp' | 'home'>('phone');
  const [message, setMessage] = useState('');
  const [wedding, setWedding] = useState<any>(null);

  const startAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    try {
      await axios.post(`http://localhost:8000/weddings/${slug}/auth/start`, { mobile });
      setStage('otp');
      setMessage('OTP sent');
    } catch (err) {
      setMessage('Invalid mobile or not invited.');
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    try {
      await axios.post(`http://localhost:8000/weddings/${slug}/auth/verify`, { mobile, code: otp });
      const res = await axios.get(`http://localhost:8000/weddings/${slug}`);
      setWedding(res.data);
      setStage('home');
    } catch (err) {
      setMessage('OTP invalid or expired.');
    }
  };

  if (stage === 'phone') return (
    <div>
      <h2>Enter Mobile for {slug}</h2>
      <form onSubmit={startAuth}>
        <input value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile" />
        <button type="submit">Send OTP</button>
      </form>
      <p>{message}</p>
    </div>
  );

  if (stage === 'otp') return (
    <div>
      <h2>Enter OTP</h2>
      <form onSubmit={verifyOtp}>
        <input value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="OTP" />
        <button type="submit">Verify</button>
      </form>
      <p>{message}</p>
    </div>
  );

  return (
    <div>
      <h2>Welcome to {wedding?.couple_name ?? 'Wedding Page'}</h2>
      <p>Venue: {wedding?.venue}</p>
      <p>Description: {wedding?.description}</p>
      <p>Feature links: comments / gifts / photos (implementation pending)</p>
    </div>
  );
}
