import React from 'react';

export default function Navbar(props) {

  const showUser = () => {
    if (window.localStorage.user) {
      return <span className="">{window.localStorage.user.toUpperCase()}</span>
    }
  }

  const logout = (event) => {
    event.preventDefault()
    window.localStorage.clear("user", "token")
    props.changeScreen("login")
  }

  return(
    <div className="relative w-full flex h-[12%] bg-blue-800 justify-center">
      <div className="flex w-1/2 h-full place-self-center space-x-20 place-items-center justify-center">
        <div className="text-2xl font-bold text-white">Neighborhoods</div>
        <div className="text-2xl font-bold text-white">Steps</div>
      </div>
      <div className="flex justify-center absolute bottom-0 right-0 w-44 inset-y-0">
        <div className="flex h-full w-4/5">
          <button onClick={logout} className="place-self-center px-4 py-2 text-white text-xl font-bold border border-2 border-white rounded-xl">Logout</button>
        </div>
      </div>
    </div>
  );
}
