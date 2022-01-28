import React, {useState} from 'react';

export default function NewUser(props) {
  const [email, updateEmail] = useState("")
  const [password, updatePassword] = useState("")

  const sendLoginRequest = () => {

  }

  const updateState = (event, func) => {
    func(event.target.value)
  }

  return(
    <div className="flex w-full h-5/6">
      <div className="flex flex-col w-1/2 h-3/4 mx-auto place-self-center ">
        <div className="my-auto">
          <div className="flex flex-col px-8 space-y-2 py-4">
            <label className="text-2xl font-bold">Email Address</label>
            <input type="text" value={email} onChange={(event) => updateState(event, updateEmail)} className="border border-black rounded-lg h-12 text-2xl px-3" />
          </div>
          <div className="flex flex-col px-8 space-y-2 py-4">
            <label className="text-2xl font-bold">Password</label>
            <input type="password" value={password} onChange={(event) => updateState(event, updatePassword)} className="border border-black rounded-lg h-12 text-2xl px-3" />
          </div>
          <div className="flex flex-col px-8 space-y-2 py-4">
            <label className="text-2xl font-bold">Password Confirmation</label>
            <input type="password" value={password} onChange={(event) => updateState(event, updatePassword)} className="border border-black rounded-lg h-12 text-2xl px-3" />
          </div>
          <div className="flex justify-center pt-3">
            <div>
              <button className="border border-black rounded-xl w-24 h-12 bg-blue-700 text-white font-bold text-2xl">Login</button>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <span 
            className="cursor-pointer hover:underline hover:text-blue-700 pt-3"
            onClick={() => props.changeScreen("login")}
          >
            I already have a login
          </span>
        </div>
      </div>

    </div>
  );
}
