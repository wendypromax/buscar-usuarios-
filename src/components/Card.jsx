// components/Card.jsx
export default function Card({ usuario, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white shadow-md rounded hover:scale-105 transition-transform duration-300 cursor-pointer"
    >
      <img
        src={usuario.foto}
        alt={usuario.nombre}
        className="w-16 h-16 rounded-full mx-auto"
      />
      <h3 className="text-center font-bold mt-2">{usuario.nombre}</h3>
      <p className="text-center text-xs text-gray-600">{usuario.perfil}</p>
      <p className="text-center text-xs text-gray-600">{usuario.intereses}</p>
      <p className="text-center text-xs text-blue-600 mt-1">{usuario.correo}</p>
    </div>
  );
}












