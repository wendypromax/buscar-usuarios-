// src/components/Modal.jsx
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()} // para que no cierre al clicar dentro
      >
        <button
          className="text-gray-500 float-right text-xl font-bold"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
