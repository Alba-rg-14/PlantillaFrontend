export default function CardSala({ title, subtitle, actions, onDetailsClick }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
                {/* Título */}
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>

                {/* Subtítulo */}
                <p className="text-gray-600">{subtitle}</p>

                {/* Botones de acciones */}
                <div className="mt-4 flex justify-between items-center space-x-2">
                    {actions && actions.length > 0 && actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className={`rounded-full px-4 py-2 font-medium shadow-md transition-transform transform hover:scale-105 ${action.label === "Eliminar"
                                ? "bg-pink-500 text-white hover:bg-pink-600"
                                : "bg-pink-300 text-pink-900"
                                }`}
                            aria-label={action.label} // Agregado para accesibilidad
                        >
                            {action.label}
                        </button>
                    ))}
                    {/* Botón "Ver detalles" */}
                    <button
                        onClick={onDetailsClick}
                        className="bg-pink-300 text-pink-900 rounded-full px-4 py-2 font-medium shadow-md transition-transform transform hover:scale-105"
                        aria-label="Ver detalles"
                    >
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    );
}
