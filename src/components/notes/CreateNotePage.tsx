import React, { useState, useEffect, useRef, useContext} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams, useLocation } from 'react-router-dom'; 
import Quill, { Delta } from 'quill';
import { useAuth } from '../../hooks/useAuth';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import fetcher from '../../services/api';   
import { CREATE_NOTE_ENDPOINT, MAX_SAVE_ATTEMPTS } from '../../utils/constants';

import Cookies from 'js-cookie';


const CreateNotePage: React.FC = () => {
    const Delta = Quill.import('delta')
    const [noteId, setNoteId] = useState("");
    const location = useLocation(); // Import useLocation
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(new Delta());
    const [isEditing, setIsEditing] = useState(false);
    const [loadedNoteContent, setLoadedNoteContent] = useState(''); // Initialize for editing
    const quillRef = useRef<ReactQuill | null>(null); 
    const navigate = useNavigate(); 
    const { refreshAccessToken } = useAuth();
    const [message, setMessage] = useState(''); // Initially no message



    useEffect(() => {
        console.log(location.state)
        // setMessage('')
        const { noteData } = location.state || {};// Fetch note data from state
        // if (!isLoggedIn) {
        //     navigate(`/signin?message=${encodeURIComponent("Your session has expired. Please log in again.")}`);
        // }
        if (noteData) {
            // Delta = Quill.import('delta')
            setIsEditing(true);
            setNoteId(noteData.id)
            setTitle(noteData.title);
            setContent(new Delta(noteData.content))
            setIsEditing(true); 
    //     // console.log(Delta)   
            
            // Convert your content (if necessary) before setting loadedNoteContent
            
            setLoadedNoteContent(new Delta(noteData.content));  
        }
    }, [location.state]);

    const handleSave:any = async () => {
        if (!title) {
            alert("Please enter a title");
            return; 
        }
        
        
        const delta = quillRef.current?.getEditor().getContents(); 
        console.log(delta)
        
        const dataToSend = {
            noteId,
            title, 
            content: delta, // Send the delta to the backend
        };
        console.log(JSON.stringify(dataToSend))

        let refreshCounter = 0;

        const attemptSave = async () => {
    
            try {
                const accessToken = Cookies.get('accessToken');
                const response: any = await fetcher(`${CREATE_NOTE_ENDPOINT}`, 
                { // Assuming '/api/notes' is your backend route
                    method: 'POST', // Or 'PUT' for editing
                    headers: { 
                        'Content-Type': 'application/json' ,
                        'Authorization': `Bearer ${accessToken}`
                
                },
                    body: JSON.stringify(dataToSend)
                });
            
               
        
                if (response.ok) {
                    const data = await response.json();
                    console.log("data is fine ", data);
                    navigate('/', { state: { successMessage: 'Note saved successfully!' } });
                    return data;
                    // navigate('/')
                    // Potentially redirect to a success page or display a message
                } else {
                    if (response.status === 401) { // Access token likely expired
                        try {
                            refreshCounter += 1
                            await refreshAccessToken();
                             
                        } catch (error:any) {
                            setMessage('Failed to refresh token:'+ error.message); 
                            console.error('Failed to refresh token:', error);
                            // Handle refresh failure (e.g., redirect to login)
                        }
                    } else {   
                        // Handle other non-successful status codes
                        const errorData = await response.json(); 
                        setMessage('Error saving note:'); 
                        console.error('Error saving note:', errorData);
                        // Display an error message or handle it according to your UI
                    }
                }
            } catch (error:any) {
                // Handle network errors or other unexpected errors
                console.error('Error saving note:', error); 
                setMessage('Error saving note:' + error.message); 
                // Display a generic error message or handle as needed
            }

        };

        

        await attemptSave()
        if (refreshCounter === 1){
            await attemptSave()
        }
        if (refreshCounter === 2){
            setMessage('please login or create account to save it' ); 
        }

    };
    


    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, 
             {'indent': '-1'}, {'indent': '+1'}],
            ['link'],
            ['image'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    return (
        <div className="dark:bg-gray-900 min-h-screen w-full flex flex-col items-center pt-10">
            {message && (
              <div className="text-green-500" role="alert"> 
                  {/* Change the class for success messages if desired */}
                  {message}
              </div>
          )}
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-1/2 p-2 mb-4 rounded-md text-black"
            />
            <ReactQuill
                theme="snow"
                value={isEditing ? loadedNoteContent : content}
                 // Load content conditionally
                // onChange={(value) => { 
                //     // Note: onChange might not be needed if you only save on button click 
                // }}
                ref={quillRef}
                modules={modules}
                formats={formats}                
                className="h-[calc(90vh-150px)] w-1/2  rounded-md overflow-hidden py-5 my-3"
                style={{ backgroundColor: 'white' }} 
            />
            <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                Save
            </button>
        </div>
    );
};

export default CreateNotePage;
