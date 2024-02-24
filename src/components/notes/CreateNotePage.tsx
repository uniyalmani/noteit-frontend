import React, { useState, useEffect, useRef} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams, useLocation } from 'react-router-dom'; 
import Quill, { Delta } from 'quill';

import Cookies from 'js-cookie';

// interface Note {
//     id: number;
//     title: string;
//     content: string;
// }

const CreateNotePage: React.FC = () => {
    const Delta = Quill.import('delta')
    const [noteId, setNoteId] = useState("");
    const location = useLocation(); // Import useLocation
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(new Delta());
    const [isEditing, setIsEditing] = useState(false);
    const [loadedNoteContent, setLoadedNoteContent] = useState(''); // Initialize for editing
    const quillRef = useRef<ReactQuill | null>(null); 



    useEffect(() => {
        console.log(location.state)
        const { noteData } = location.state || {};// Fetch note data from state
        console.log(noteData)
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

    const handleSave = async () => {
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
    
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await fetch('http://127.0.0.1:8000/api/notes/createnote/', { // Assuming '/api/notes' is your backend route
                method: 'POST', // Or 'PUT' for editing
                headers: { 
                    'Content-Type': 'application/json' ,
                    'Authorization': `Bearer ${accessToken}`
            
            },
                body: JSON.stringify(dataToSend)
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                console.log("data is fine ")
                
        return data;
            } else {
                // Handle error
            }
        } catch (error) {
            console.error("Error saving note:", error);
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
