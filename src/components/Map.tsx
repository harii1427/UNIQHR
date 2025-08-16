import React, { memo, useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';

const Map = memo(() => {
  const position: [number, number] = [11.0168, 76.9558]; // Coimbatore coordinates
  const mapRef = useRef<LeafletMap>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(position, 13);
    }
  }, [mapRef, position]);

  return (
    <MapContainer ref={mapRef} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Uniq HR. <br /> Coimbatore.
        </Popup>
      </Marker>
    </MapContainer>
  );
});

export default Map;
