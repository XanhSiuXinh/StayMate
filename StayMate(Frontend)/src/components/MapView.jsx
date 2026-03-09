import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MapPin, Maximize } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '24px'
};

const MapView = ({ rooms = [] }) => {
  const { t } = useTranslation();
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Default center (Ho Chi Minh City)
  const defaultCenter = {
    lat: 10.762622,
    lng: 106.660172
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    if (rooms.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      rooms.forEach(room => {
        if (room.latitude && room.longitude) {
          bounds.extend({ lat: room.latitude, lng: room.longitude });
        }
      });
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      }
    }
    setMap(map);
  }, [rooms]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl flex items-center justify-center italic text-gray-500">Loading Maps...</div>;

  return (
    <div className="relative w-full animate-in fade-in duration-500">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={rooms.length > 0 && rooms[0].latitude ? { lat: rooms[0].latitude, lng: rooms[0].longitude } : defaultCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
            styles: [
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }]
                }
            ],
            disableDefaultUI: false,
            zoomControl: true,
        }}
      >
        {rooms.map(room => (
          room.latitude && room.longitude && (
            <Marker
              key={room.roomId}
              position={{ lat: room.latitude, lng: room.longitude }}
              onClick={() => setSelectedRoom(room)}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              }}
            />
          )
        ))}

        {selectedRoom && (
          <InfoWindow
            position={{ lat: selectedRoom.latitude, lng: selectedRoom.longitude }}
            onCloseClick={() => setSelectedRoom(null)}
          >
            <div className="p-1 max-w-[200px] cursor-pointer" onClick={() => window.location.href = `/rooms/${selectedRoom.roomId}`}>
              <img 
                src={selectedRoom.photoUrls[0] || 'https://via.placeholder.com/200x120'} 
                className="w-full h-24 object-cover rounded-lg mb-2" 
                alt={selectedRoom.title} 
              />
              <h4 className="font-bold text-gray-900 text-sm truncate">{selectedRoom.title}</h4>
              <div className="flex items-center gap-1 text-primary font-bold text-xs mb-1">
                {selectedRoom.price.toLocaleString()} VND
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                  <Star size={10} className="text-yellow-500 fill-yellow-500" />
                  {selectedRoom.averageRating.toFixed(1)}
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Maximize size={10} /> {selectedRoom.areaSqm}m²
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      <div className="absolute top-4 left-4 right-4 pointer-events-none">
          <div className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg text-xs font-bold text-gray-700 dark:text-gray-200 pointer-events-auto">
              {rooms.filter(r => r.latitude).length} {t('rooms.locations_found')}
          </div>
      </div>
    </div>
  );
};

export default MapView;
