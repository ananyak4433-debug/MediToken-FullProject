import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';

// Marker Component
const LocationMarker = ({ text }) => (
    <div style={{ 
        color: 'red', 
        fontSize: '20px', 
        fontWeight: 'bold', 
        transform: 'translate(-50%, -100%)' // Centers the pin icon
    }}>
        📍
    </div>
);

export default function LocationMapPicker({ initialLocation, onLocationSelect }) {
    
    const API_KEY = "AIzaSyBqnXbn2rQvcrRE7FxtGnCk8CguV9ExDO8"; // 🔑 Use your actual key

    // 1. Initialize local state for the marker position
    // Parses initialLocation strings to numbers, defaulting to Kerala center if null
    const initialLat = parseFloat(initialLocation?.[0]) || 9.954197292297296;
    const initialLng = parseFloat(initialLocation?.[1]) || 76.29988268403412;
    
    const [markerCoords, setMarkerCoords] = useState({ 
        lat: initialLat, 
        lng: initialLng 
    });

    // 2. Sync external changes (e.g., if coordinates are cleared by parent form)
    useEffect(() => {
        const newLat = parseFloat(initialLocation?.[0]);
        const newLng = parseFloat(initialLocation?.[1]);

        // Only update local state if external state is different from local state
        if (!isNaN(newLat) && !isNaN(newLng) && 
            (newLat !== markerCoords.lat || newLng !== markerCoords.lng)) {
            
            setMarkerCoords({ lat: newLat, lng: newLng });
        }
    }, [initialLocation]);


    const defaultProps = {
        center: { lat: initialLat, lng: initialLng },
        zoom: 13 
    };
    
    // 3. Handle Map Click Event (Picking a new location)
    const handleMapClick = ({ lat, lng }) => {
        // Update local state to move the marker
        setMarkerCoords({ lat, lng });

        // Update parent Formik state
        if (onLocationSelect) {
            onLocationSelect([lat, lng]);
        }
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: API_KEY }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                onClick={handleMapClick} // Capture coordinates on click
            >
                {/* 4. Marker rendered at the current state location */}
                <LocationMarker
                    lat={markerCoords.lat}
                    lng={markerCoords.lng}
                    text={`Lat: ${markerCoords.lat.toFixed(4)}, Lng: ${markerCoords.lng.toFixed(4)}`}
                />
            </GoogleMapReact>
        </div>
    );
}