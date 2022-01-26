import './wdyr'; 

import React, {useState, useEffect, useRef} from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from "leaflet"
import './App.css';
import MyMap from './components/MyMap.js'

function App() {
  const multiPolyline = [
    [
      [-79.9571735198579, 40.43098710544862],
      [-79.95700656796235, 40.43086574964221]
    ],
    [
      [
        -79.98821520631328,
        40.42245483675622
        ],
        [
        -79.98821520631328,
        40.42236499206393]
    ]
  ]

  const multiPolyLineOptions = {color: "blue"}

  const position = [40.447940, -79.975181]

  return (
    <div className="w-full">
      <h1 className="text-5xl text-center">My Map</h1>
      <div className="w-full flex">
        <MyMap />
      </div>

    </div>
  //   <MapContainer center={position} zoom={12} minZoom={12} scrollWheelZoom={true} inertia={true} wheelDebounceTime={20}>
  //   <TileLayer
  //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //   />
  //   <Polyline pathOptions={multiPolyLineOptions} positions={multiPolyline} />
  // </MapContainer>
  );
}

export default App;
