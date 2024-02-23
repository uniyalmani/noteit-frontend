import React, { useState, useEffect } from 'react';
import NoteCard from "./NoteCard";
import notesData from '../../data/notesData.json';
import '../../customScrollbar.css'; 
import   '../../interfaces';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


interface Props { } 

const NoteList: React.FC<Props> = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchNotes = async () => {
            try {
            // const notesData = require('../../data/notesData.json');
            // console.log(response) // Relative path
            // const notesData = await response.json();
            console.log(notesData)
            setNotes(notesData);
        } catch (error) {
            console.error('Error fetching notes data:', error);
          }
    
        };

        fetchNotes();
    }, []);

    const handleCreateNewNote = () => {
        navigate('/createnote'); 
    };

    return (
        <div className="flex flex-wrap justify-center h-screen overflow-auto dark:bg-gray-900">
            
            <div 
                className="w-1/4 p-6 mb-4 m-4 max-w-sm bg-white border  border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer flex flex-col items-center justify-center" 
                onClick={handleCreateNewNote}
                >
            <FontAwesomeIcon icon={faPlus} size="4x" color='white' className="mb-2" /> 
            <p className="text-gray-900 dark:text-white text-lg">Create New Note</p>
            </div>
            {notes.map((note) => (
                <NoteCard
                    key={note.id}
                    note={note} // Pass the entire note object
                />
            ))}
        </div>
    );
};



function extractImages(content: ContentItem[]) { 
    const images: string[] = [];
    content.forEach(item => {
        if (typeof item.insert !== 'string' && item.insert.image) {
            images.push(item.insert.image);
        }
    });
    return images;
}

export default NoteList;
