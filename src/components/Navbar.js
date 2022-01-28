import React from 'react';

export default function Navbar() {

  const showUser = () => {
    if (window.localStorage.user) {
      return <span className="">{window.localStorage.user.toUpperCase()}</span>
    }
  }

  return(
    <div className="w-full h-20 bg-blue-800">
      {showUser()}
      <h1 className="text-3xl font-bold text-white text-center">My Map</h1>
    </div>
  );
}
