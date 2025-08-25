import React, { useEffect, useState } from 'react';
import api from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [itemsByAgent, setItemsByAgent] = useState({});
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', mobile: '+91', password: '' });

  const loadAgents = async () => {
    const { data } = await api.get('/api/agents');
    setAgents(data);
  };

  const onCreateAgent = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      const { data } = await api.post('/api/agents', form);
      setForm({ name: '', email: '', mobile: '+91', password: '' });
      setMsg('Agent created: ' + data.email);
      await loadAgents();
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMsg('Please select a file');
      return;
    }
    setBusy(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/api/upload/file', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const map = {};
      for (const g of data.agents) {
        map[g.agent._id] = g.items;
      }
      setItemsByAgent(map);
      setMsg('Uploaded and distributed ' + data.total + ' items.');
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  const viewItems = async (agentId) => {
    const { data } = await api.get('/api/upload/items/' + agentId);
    setItemsByAgent((prev) => ({ ...prev, [agentId]: data }));
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button
          className="secondary-btn"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.replace('/login');
          }}
        >
          Logout
        </button>
      </header>

      {msg && <p className={`msg ${msg.includes('error') ? 'error' : 'success'}`}>{msg}</p>}

      <div className="grid-container">
        <div className="form-card">
          <h2>Add Agent</h2>
          <form onSubmit={onCreateAgent}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              placeholder="Mobile (+CountryCode)"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              required
            />
            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button disabled={busy} type="submit" className="primary-btn">
              {busy ? 'Saving...' : 'Create Agent'}
            </button>
          </form>
        </div>

        <div className="upload-card">
          <h2>Upload List (CSV/XLSX/XLS)</h2>
          <form onSubmit={onUpload}>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              disabled={busy}
              type="submit"
              className="primary-btn"
              style={{ marginTop: '10px' }}
            >
              {busy ? 'Uploading...' : 'Upload & Distribute'}
            </button>
          </form>
          <p className="note-text">
            Expected headers: FirstName, Phone, Notes (case-insensitive).
          </p>
        </div>
      </div>

      <h2 style={{ marginTop: '30px' }}>Agents</h2>
      <div className="agent-grid">
        {agents.map((a) => (
          <div key={a._id} className="agent-card">
            <div className="agent-header">
              <strong>{a.name}</strong>
              <button onClick={() => viewItems(a._id)} className="secondary-btn">
                View Items
              </button>
            </div>
            <div className="agent-info">
              <div>{a.email}</div>
              <div>{a.mobile}</div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>FirstName</th>
                  <th>Phone</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {(itemsByAgent[a._id] || []).map((it) => (
                  <tr key={it._id}>
                    <td>{it.firstName}</td>
                    <td>{it.phone}</td>
                    <td>{it.notes}</td>
                  </tr>
                ))}
                {(!itemsByAgent[a._id] || itemsByAgent[a._id].length === 0) && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', opacity: 0.6 }}>
                      No items yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
