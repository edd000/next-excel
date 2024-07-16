import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';


export default function Register() {
  const [machines, setMachines] = useState([]);
  const [area, setArea] = useState('');
  const [machine, setMachine] = useState('');
  const [description, setDescription] = useState('');
  const [requester, setRequester] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchMachines = async () => {
      const response = await axios.get('/api/machines');
      setMachines(response.data.machines);
    };
    fetchMachines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!area || !machine || !description || !requester) {
      setMessage('Por favor rellene todos los campos.');
      return;
    }

    try {
      const response = await axios.post('/api/register', {
        area,
        machine,
        description,
        requester,
      });
      setMessage(response.data.message);

      setArea('');
      setMachine('');
      setDescription('');
      setRequester('');
    } catch (error) {
      setMessage('Error submitting the form');
    }
  };

  const handleAreaChange = (e) => {
    setArea(e.target.value);
    setMachine('');
  };

  const handleMachineChange = (e) => {
    setMachine(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleRequesterChange = (e) => {
    setRequester(e.target.value);
  };

  const handleGoHome = () => {
    router.push('/'); // Redirige a la página principal
  };

  return (
    <div className="container">
      <h1>Registro de Solicitudes</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Area:</label>
          <select value={area} onChange={handleAreaChange}>
            <option value="">Selecciona el Area</option>
            {Array.from(new Set(machines.map(m => m.area))).map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Equipos:</label>
          <select value={machine} onChange={handleMachineChange} disabled={!area}>
            <option value="">Selecciona el Equipo</option>
            {machines.filter(m => m.area === area).map(m => (
              <option key={m.machine} value={m.machine}>{m.machine}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Descripcion:</label>
          <textarea value={description} onChange={handleDescriptionChange}></textarea>
        </div>
        <div className="form-group">
          <label>Nombre del Solicitante:</label>
          <input type="text" value={requester} onChange={handleRequesterChange} />
        </div>
        <button type="submit">Enviar</button>
        <button type="button" onClick={handleGoHome}>Pagina principal</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
