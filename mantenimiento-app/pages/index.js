import { useRouter } from 'next/router';
import Image from 'next/image'; // Importa el componente Image de Next.js

export default function Home() {
  const router = useRouter();

  const handleGoToForm = () => {
    router.push('/register'); // Redirige a la página del formulario
  };

  return (
    <div className="home-container">
      <Image src="/logo.jpg" alt="Logo" width={460} height={200} />
      <h1>Bienvenido al Sistema de Solicitudes de Mantenimiento</h1>
      <button onClick={handleGoToForm} className="go-to-form-button">Ir al Formulario de Registro de Solicitudes</button>
    </div>
  );
}
