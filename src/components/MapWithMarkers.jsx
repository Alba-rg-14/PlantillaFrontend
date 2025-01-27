import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configuración del icono predeterminado de Leaflet
const defaultIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const MapWithMarkers = ({
    markers = [], // Array de coordenadas {lat, lon}
    defaultCenter = [40.416775, -3.703790], // Centro por defecto (España)
    defaultZoom = 5, // Zoom por defecto
}) => {
    // Calcular los límites (bounding box) según los marcadores
    const calculateBounds = (markers) => {
        if (!markers || markers.length === 0) return null;

        const latitudes = markers.map((m) => m.lat);
        const longitudes = markers.map((m) => m.lon);

        const southWest = [Math.min(...latitudes), Math.min(...longitudes)];
        const northEast = [Math.max(...latitudes), Math.max(...longitudes)];

        return [southWest, northEast];
    };

    const bounds = calculateBounds(markers);

    // Componente interno para ajustar el mapa según los marcadores
    const FitBounds = ({ bounds }) => {
        const map = useMap();
        if (bounds) {
            map.fitBounds(bounds);
        }
        return null;
    };

    return (
        <MapContainer
            center={defaultCenter} // Centro inicial
            zoom={defaultZoom} // Zoom inicial
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {bounds && <FitBounds bounds={bounds} />} {/* Ajustar mapa según marcadores */}
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lon]} icon={defaultIcon}>
                    <Popup>{`${marker.nombre}`}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};
//CAMBIAR AQUI LO QUE QUIERAS PONER EN EL POP UP
export default MapWithMarkers;
