import React, { useEffect, useState } from 'react';

type Holiday = {
  id: string;
  start: string;
  end: string;
  label?: string;
};

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export default function HolidaysManager() {
  const [items, setItems] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ start: '', end: '', label: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/holidays`);
      const data = await res.json();
      setItems(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`${API}/holidays/${editingId}`, {
          method: 'PUT',
          headers: headers(),
          body: JSON.stringify(form),
        });
        if (res.ok) {
          await load();
          setForm({ start: '', end: '', label: '' });
          setEditingId(null);
        }
      } else {
        const res = await fetch(`${API}/holidays`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify(form),
        });
        if (res.ok) {
          await load();
          setForm({ start: '', end: '', label: '' });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette période de vacances ?')) return;
    try {
      const res = await fetch(`${API}/holidays/${id}`, { method: 'DELETE', headers: headers() });
      if (res.ok) await load();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (h: Holiday) => {
    setEditingId(h.id);
    setForm({ start: h.start, end: h.end, label: h.label ?? '' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Gérer les plages de vacances</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-sm">Date de début</label>
              <input type="date" className="mt-1 w-full border rounded px-2 py-1" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm">Date de fin</label>
              <input type="date" className="mt-1 w-full border rounded px-2 py-1" value={form.end} onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm">Libellé</label>
              <input type="text" className="mt-1 w-full border rounded px-2 py-1" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded">{editingId ? 'Enregistrer' : 'Ajouter'}</button>
              {editingId && <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setEditingId(null); setForm({ start: '', end: '', label: '' }); }}>Annuler</button>}
            </div>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow max-h-[480px] overflow-y-auto">
          <h2 className="text-lg font-medium mb-2">Liste</h2>
          {loading ? (
            <div>Chargement…</div>
          ) : (
            <ul className="space-y-2">
              {items.map((h) => (
                <li key={h.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{h.label ?? 'Vacances'}</div>
                    <div className="text-sm text-gray-600">{new Date(h.start).toLocaleDateString()} → {new Date(h.end).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(h)} className="px-2 py-1 bg-yellow-100 rounded">Modifier</button>
                    <button onClick={() => remove(h.id)} className="px-2 py-1 bg-red-100 rounded">Supprimer</button>
                  </div>
                </li>
              ))}
              {items.length === 0 && <li className="text-sm text-gray-500">Aucune plage définie.</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
