import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import { useParams } from 'react-router-dom'; 
import { GET_NOTE_BY_PUBLIC_ID_ENDPOINT } from '../../utils/constants';
import fetcher from '../../services/api';


const PublicNotePage:React.FC = () => {
    const Delta = Quill.import('delta')
    // const [note, setNote] = useState(null);
    const [message, setMessage] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState(new Delta());
    const { publicId } = useParams(); 

    
    useEffect(() => {
        console.log(publicId)
        
        const fetchNote = async () => {
            try {
                console.log(`${GET_NOTE_BY_PUBLIC_ID_ENDPOINT}${publicId}`)
                const response:any = await fetcher(`${GET_NOTE_BY_PUBLIC_ID_ENDPOINT}${publicId}/`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
    
                    }

                }
                );
                console.log(response)
                if (!response.ok) {
                    throw new Error('Failed to fetch note');
                }
                const noteData = await response.json();
                console.log(noteData.data.content)
                setTitle(noteData.data.title);
                setContent(new Delta(noteData.data.content))
            } catch (error) {
                console.log(error)
                setMessage('Error fetching note');
                console.error('Error fetching note:', error);
            }
        };

        fetchNote();
    },[publicId]);



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
                placeholder="Title"
                className="w-1/2 p-2 mb-4 rounded-md text-black"
            />
            <ReactQuill
                theme="snow"
                value={content}
                readOnly={true}
                 // Load content conditionally
                // onChange={(value) => { 
                //     // Note: onChange might not be needed if you only save on button click 
                // }}
                // ref={quillRef}
                modules={modules}
                formats={formats}                
                className="h-[calc(90vh-150px)] w-1/2  rounded-md overflow-hidden py-5 my-3"
                style={{ backgroundColor: 'white' }} 
            />
            
        </div>
    );
};

export default PublicNotePage;
