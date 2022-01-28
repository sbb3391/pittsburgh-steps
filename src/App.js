import './wdyr'; 

import React, {useState, useEffect, useRef} from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from "leaflet"
import './App.css';
import MyMap from './components/MyMap.js';
import Navbar from './components/Navbar.js';
import Login from './components/Login.js'
import NewUser from './components/NewUser.js'

function App() {

  const [screen, changeScreen] = useState()
 
  useEffect( () => {
    if (window.localStorage.user) {
      changeScreen("myMap")
    } else {
      changeScreen("login")
    }
  }, [])


  const determineScreen = () => {
    switch (screen) {
      case "login":
        return <Login changeScreen={changeScreen} />
      case "myMap":
        return <MyMap />
      case "newUser":
        return <NewUser changeScreen={changeScreen} />
    }
  }

  return (
    <div className="w-full h-screen">
      <Navbar />
      {determineScreen()}
    </div>
  );
}

export default App;
