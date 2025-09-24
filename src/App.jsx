import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Card from './components/Card';
import SearchInput from './components/Searchinput';
import Modal from './components/modal';
import Spinner from './components/Spinner';

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const obtenerUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/usuarios');
      setUsuarios(response.data);
      setFiltrados(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const filtrarUsuarios = useCallback(
    (query) => {
      setLoading(true); // <-- activo el loading cuando empieza a buscar
      const q = query.trim().toLowerCase();

      // Simulo retardo para mostrar spinner (en una búsqueda real con API, aquí harías fetch)
      setTimeout(() => {
        const resultados = usuarios.filter((usuario) =>
          [usuario.nombre, usuario.perfil, usuario.email]
            .some((campo) => String(campo).toLowerCase().includes(q))
          ||
          (Array.isArray(usuario.intereses)
            ? usuario.intereses.some(interes => interes.toLowerCase().includes(q))
            : String(usuario.intereses).toLowerCase().includes(q))
        );
        setFiltrados(resultados);
        setLoading(false); // <-- desactivo el loading cuando termina el filtrado
      }, 500); // 500ms para que se note el spinner
    },
    [usuarios]
  );

  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setUsuarioSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">BUSCADOR DE USUARIOS</h1>
      <SearchInput onSearch={filtrarUsuarios} />

      {loading ? (
        <Spinner />
      ) : (
        filtrados.map((usuario) => (
          <div key={usuario.id} onClick={() => abrirModal(usuario)}>
            <Card usuario={usuario} />
          </div>
        ))
      )}

      <Modal isOpen={modalOpen} onClose={cerrarModal}>
        {usuarioSeleccionado && (
          <div>
            <h2 className="text-xl font-bold mb-2">{usuarioSeleccionado.nombre}</h2>
            <img
              src={usuarioSeleccionado.foto}
              alt={usuarioSeleccionado.nombre}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <p><strong>Perfil:</strong> {usuarioSeleccionado.perfil}</p>
            <p>
              <strong>Intereses:</strong>{' '}
              {Array.isArray(usuarioSeleccionado.intereses)
                ? usuarioSeleccionado.intereses.join(', ')
                : usuarioSeleccionado.intereses}
            </p>
            <p><strong>Email:</strong> {usuarioSeleccionado.correo}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
