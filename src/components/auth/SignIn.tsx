import  { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function SignIn(){

    // const history = useHistory();
    const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams(); 
  const errorMessage = searchParams.get('message'); 
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // console.log("inside the submit ")
        console.log(email, password)
        // console.log(login)
      await login(email, password);
      setSuccessMessage('Login successful! Redirecting to home page...');
      navigate('/'); 
    //   history.push('/'); // Redirect to home page after successful login
    } catch (error: any) {
        // console.log(error)
      setError(error.message);
    }
  };

    return (

       

<section className="bg-gray-50 dark:bg-gray-900 h-screen">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Remember It All</h1>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Capture your thoughts and ideas with Note It. Your mind is a playground, Note It is your key. Unlock your potential, unleash your magic. Don't just remember, create. Every note, a step towards your limitless future.</p>
            
        </div>
        <div>
            <div className="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sign in to NoteIt
                </h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6" action="#">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    
                    <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                    
                </form>
                {error && (
              <div className="text-red-500" role="alert">
                {error}
              </div>
            )}
            {errorMessage && (
            <div className="text-red-500" role="alert"> 
            {errorMessage}
            {successMessage && <div className='text-green-500'>{successMessage}</div>}
  </div>
)}
            </div>
        </div>
    </div>
</section>


    )
}

export default SignIn