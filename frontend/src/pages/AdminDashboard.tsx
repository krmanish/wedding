import { useEffect, useState } from 'react';
import axios from 'axios';

interface WeddingForm { couple_name: string; slug: string; theme: string; venue: string; description: string; }
interface GuestForm { name: string; mobile: string; }

export default function AdminDashboard() {
  const [weddingForm, setWeddingForm] = useState<WeddingForm>({ couple_name: '', slug: '', theme: '', venue: '', description: '' });
  const [guestForm, setGuestForm] = useState<GuestForm>({ name: '', mobile: '' });
  const [weddings, setWeddings] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => { fetchWeddings(); }, []);

  const fetchWeddings = async () => {
    const res = await axios.get('http://localhost:8000/weddings');
    setWeddings(res.data);
  };

  const createWedding = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/admin/weddings', weddingForm);
    setWeddingForm({ couple_name: '', slug: '', theme: '', venue: '', description: '' });
    await fetchWeddings();
  };

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    await axios.post(`http://localhost:8000/admin/weddings/${selectedId}/guests`, guestForm);
    setGuestForm({ name: '', mobile: '' });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <section>
        <h3>Create Wedding Page</h3>
        <form onSubmit={createWedding}>
          <input placeholder="Couple name" value={weddingForm.couple_name} onChange={(e)=>setWeddingForm({...weddingForm,couple_name:e.target.value})}/>
          <input placeholder="Slug" value={weddingForm.slug} onChange={(e)=>setWeddingForm({...weddingForm,slug:e.target.value})}/>
          <input placeholder="Theme" value={weddingForm.theme} onChange={(e)=>setWeddingForm({...weddingForm,theme:e.target.value})}/>
          <input placeholder="Venue" value={weddingForm.venue} onChange={(e)=>setWeddingForm({...weddingForm,venue:e.target.value})}/>
          <textarea placeholder="Description" value={weddingForm.description} onChange={(e)=>setWeddingForm({...weddingForm,description:e.target.value})}/>
          <button type="submit">Create</button>
        </form>
      </section>
      <section>
        <h3>Current Weddings</h3>
        <ul>{weddings.map((w)=><li key={w.id}><button onClick={()=>setSelectedId(w.id)}>{w.couple_name} ({w.slug})</button></li>)}</ul>
      </section>
      <section>
        <h3>Add Guest</h3>
        <form onSubmit={addGuest}>
          <input placeholder="Name" value={guestForm.name} onChange={(e)=>setGuestForm({...guestForm,name:e.target.value})}/>
          <input placeholder="Mobile" value={guestForm.mobile} onChange={(e)=>setGuestForm({...guestForm,mobile:e.target.value})}/>
          <button type="submit">Add</button>
        </form>
        {selectedId && <p>Adding guest to wedding ID {selectedId}</p>}
      </section>
    </div>
  );
}
