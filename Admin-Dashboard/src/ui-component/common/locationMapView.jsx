import React from "react";
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import LocationOn from "@mui/icons-material/LocationOn";
import {  Typography,  } from '@mui/material';



// Marker Component (Kept simple)
const LocationMarker = ({ text }) => (
    <div style={{ 
        color: 'red', 
        fontSize: '24px', 
        fontWeight: 'bold', 
        cursor: 'default',
        transform: 'translate(-50%, -100%)' // Centers the pin icon
    }} title={text}>
        📍 {/* Location Pin Emoji */}
    </div>
);

// --- New Display-Only Component ---
export default function LocationMapViewer({ location, zoom = 15 }) {
    
    const API_KEY = "AIzaSyBqnXbn2rQvcrRE7FxtGnCk8CguV9ExDO8"; 

    const lat = parseFloat(location?.[0]);
    const lng = parseFloat(location?.[1]);
    
    const defaultLat = 9.954197292297296; 
    const defaultLng = 76.29988268403412;

    const centerLat = !isNaN(lat) ? lat : defaultLat;
    const centerLng = !isNaN(lng) ? lng : defaultLng;
    
    const hasValidLocation = !isNaN(lat) && !isNaN(lng);

    if (!hasValidLocation) {
        return (
            <div style={{ height: '200px', width: '100%', border: '1px solid #ccc', padding: '20px', textAlign: 'center' }}>
                <LocationOn color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                    Location data is not available for this facility.
                </Typography>
            </div>
        );
    }
    
    // Map properties for display
    const mapProps = {
        center: { lat: centerLat, lng: centerLng },
        zoom: zoom 
    };

    return (
        <div style={{ height: '200px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: API_KEY }}
                center={mapProps.center}
                defaultZoom={mapProps.zoom}
                options={{
                    // 2. Disable all interactive elements for a view-only map
                    clickableIcons: false,
                    draggable: false,     // Disable dragging the map
                    zoomControl: false,   // Optionally disable zoom controls
                    scrollwheel: false,   // Disable zooming with the mouse wheel
                    disableDoubleClickZoom: true,
                    // Optional: disable panning via keyboard arrows
                    keyboardShortcuts: false, 
                }}
                // 3. Remove the onClick handler entirely
            >
                {/* Marker rendered at the exact location */}
                <LocationMarker
                    lat={centerLat}
                    lng={centerLng}
                    text={`Location: ${centerLat.toFixed(6)}, ${centerLng.toFixed(6)}`}
                />
            </GoogleMapReact>
        </div>
    );
}

LocationMapViewer.propTypes = {
    // Expects an array of [latitude, longitude] strings or numbers
    location: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])), 
    zoom: PropTypes.number,
};

// Example Usage in your FacilityDetailModal:
/*
<LocationMapViewer 
    location={[facility.latitude, facility.longitude]} // Pass the coordinates
    zoom={16}
/>
*/