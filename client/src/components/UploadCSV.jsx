import { useState } from 'react';
import API from '../api'; // Make sure api.js exists in src/

export default function UploadCSV() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMsg('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error uploading file');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <h3>Upload CSV/XLS/XLSX</h3>
      <input
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Upload</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
