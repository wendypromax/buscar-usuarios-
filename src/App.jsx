import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import SearchInput from './components/Searchinput';
import Card from './components/Card';

const Spinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
  </div>
);

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="bg-white rounded p-6 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" aria-label="Cerrar modal">✕</button>
        {children}
      </div>
    </div>
  );
};

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
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
      setSearching(true);

      setTimeout(() => {
        const q = query.trim().toLowerCase();
        const resultados = usuarios.filter((usuario) =>
          ['nombre', 'perfil', 'intereses', 'correo'].some((campo) =>
            String(usuario[campo]).toLowerCase().includes(q)
          )
        );
        setFiltrados(resultados);
        setSearching(false);
      }, 300); // 300ms delay para simular búsqueda async
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

      {(loading || searching) ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {filtrados.map((usuario) => (
            <div key={usuario.id} onClick={() => abrirModal(usuario)} className="cursor-pointer">
              <Card usuario={usuario} />
            </div>
          ))}
        </div>
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
            <p><strong>Intereses:</strong> {usuarioSeleccionado.intereses}</p>
            <p><strong>Email:</strong> {usuarioSeleccionado.correo}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
