function App() {
  const [form, setForm] = React.useState({
    phoneNumber: '',
    topic: '',
    userName: ''
  });
  const [status, setStatus] = React.useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Calling...');
    try {
      const res = await fetch('/schedule-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Call initiated with ID: ' + data.id);
      } else {
        setStatus(data.error || 'Error scheduling');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error scheduling');
    }
  };

  return (
    <div id="app-container">
      <h2>Place a Call</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Phone Number: </label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
        </div>
        <div>
          <label>Topic: </label>
          <input name="topic" value={form.topic} onChange={handleChange} />
        </div>
        <div>
          <label>User Name: </label>
          <input name="userName" value={form.userName} onChange={handleChange} />
        </div>
        <button type="submit">Call Now</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
