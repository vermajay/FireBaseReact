import { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import { toast } from 'react-hot-toast';
import { BsGoogle } from 'react-icons/bs'

const Auth = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [render, setRender] = useState(true);

    console.log(auth?.currentUser?.email);

    const signIn = async (event) => {  
        event.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth, email, password);
        }
        catch(error){
            toast.error(error.message);
        }
        setEmail("");
        setPassword("");
    }

    const signInWithGoogle = async (event) => {  
        event.preventDefault();
        try{
            await signInWithPopup(auth, googleProvider);
        }
        catch(error){
            toast.error(error.message);
        }
    }

    const logout = async (event) => {  
        event.preventDefault();
        try{
            await signOut(auth);
            setRender(!render);
            toast.success("Logged out");
        }
        catch(error){
            toast.error(error.message);
        }
    }

  return (
    <div>

        <div className='flex justify-between mb-4'>
            <p>Current User: {auth?.currentUser?.email}</p>
            <button onClick={logout}
             className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Log Out</button>
        </div>

        <form className='flex flex-col gap-2' onSubmit={signIn}>
            <p>Sign In with email</p>
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                placeholder='Email...'
                type='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                placeholder='Password...'
                type='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign In</button>
        </form>

        <div className='w-full h-[2px] bg-black mt-7'></div>
        <p className='text-center bg-gray-200'>OR</p>
        <div className='w-full h-[2px] bg-black mb-7'></div>

        <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" onClick={signInWithGoogle}>
            <BsGoogle/>
            Sign In with Google
        </button>

    </div>
  )
}

export default Auth;