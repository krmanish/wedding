import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div>
      <h2>Welcome to Your Wedding Invite Portal</h2>
      <p>Create custom wedding pages, send invite links, and let guests share blessing tokens.</p>
      <ul>
        <li>Admin creates wedding pages and adds invited guest mobile numbers</li>
        <li>Guests can login with mobile + OTP and RSVP</li>
        <li>Comments with moderation, gifts, photo uploads</li>
      </ul>
      <p><Link to="/admin">Go to Admin login</Link></p>
    </div>
  );
}
