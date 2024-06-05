import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [machines, setMachines] = useState([]);
  const [area, setArea] = useState('');
  const [machine, setMachine] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMachines = async () => {
      const response = await axios.get('/api/machines');
      setMachines(response.data.machines);
    };
    fetchMachines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que todos los campos estén completos
    if (!area || !machine || !description) {
      setMessage('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post('/api/register', {
        area,
        machine,
        description,
      });
      setMessage(response.data.message);

      // Limpiar el formulario después de una respuesta exitosa
      setArea('');
      setMachine('');
      setDescription('');
    } catch (error) {
      setMessage('Error submitting the form');
    }
  };

  const handleAreaChange = (e) => {
    setArea(e.target.value);
    setMachine(''); // Resetear el campo de máquina cuando cambia el área
  };

  const handleMachineChange = (e) => {
    setMachine(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div>
      <h1>Maintenance Request Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Area:</label>
          <select value={area} onChange={handleAreaChange}>
            <option value="">Select an area</option>
            {Array.from(new Set(machines.map(m => m.area))).map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Machine:</label>
          <select value={machine} onChange={handleMachineChange} disabled={!area}>
            <option value="">Select a machine</option>
            {machines.filter(m => m.area === area).map(m => (
              <option key={m.machine} value={m.machine}>{m.machine}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={handleDescriptionChange}></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
