import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthContext } from '../../AuthContext';

function SignUp(){

    const { signup } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("inside the submit ")
            console.log(email, password)
            console.log()
          await signup(username, email, password);
        //   history.push('/'); // Redirect to home page after successful login
        } catch (error: any) {
          setError(error.message);
        }
      };


    return (

        <section className="bg-gray-50 dark:bg-gray-900 h-screen">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Remember It All</h1>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Capture your thoughts and ideas with Note It. Your mind is a playground, Note It is your key. Unlock your potential, unleash your magic. Don't just remember, create. Every note, a step towards your limitless future.</p>
            <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Read more about our app 
                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
        </div>
        <div>
            <div className="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sign Up to NoteIt
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} action="#" >
                    <div>
                        <label for="usename" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                        <input type="text" onChange={(e) => setUsername(e.target.value)} name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" required />
                    </div>
                    <div>
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" name="remember" type="checkbox" className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        <div className="ms-3 text-sm">
                        <label for="remember" className="font-medium text-gray-500 dark:text-gray-400">Remember this device</label>
                        </div>
                        <a href="#" className="ms-auto text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Lost Password?</a>
                    </div>
                    <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Not registered yet? <a className="text-blue-600 hover:underline dark:text-blue-500">Create account</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

    )
}

export default SignUp