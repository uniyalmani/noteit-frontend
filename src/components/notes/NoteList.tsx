import React, { useState, useEffect } from 'react';
import NoteCard from "./NoteCard";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const NoteList: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const accessToken = Cookies.get('accessToken');
                const response = await fetch('http://127.0.0.1:8000/api/notes/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Request failed with status: ${response.status}`);
                }

                const data = await response.json();
                setNotes(data.results);
                setNextPageUrl(data.next);
            } catch (error) {
                console.error('Error fetching notes data:', error);
            }
        };

        fetchNotes();
    }, []);

    const handleCreateNewNote = () => {
        navigate('/createnote');
    };

    const updateNoteList = (deletedNoteId: number) => {
        setNotes(prevNotes => {
            const updatedNotes = prevNotes.filter(note => note.id !== deletedNoteId);
            return [...updatedNotes];
        });
    };

    const handleLoadMore = async () => {
        try {
            if (nextPageUrl) {
                const accessToken = Cookies.get('accessToken');
                const response = await fetch(nextPageUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Request failed with status: ${response.status}`);
                }

                const data = await response.json();
                setNotes(prevNotes => [...prevNotes, ...data.results]);
                setNextPageUrl(data.next);
            }
        } catch (error) {
            console.error('Error fetching next page of notes:', error);
        }
    };

    return (
        <div className="flex flex-wrap justify-center h-screen overflow-auto dark:bg-gray-900">
            <div
                className="w-1/4 p-6 mb-4 m-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer flex flex-col items-center justify-center"
                onClick={handleCreateNewNote}
                style={{ maxHeight: '50vh', maxWidth: '50vh' }}
            >
                <FontAwesomeIcon icon={faPlus} size="4x" color='white' className="mb-2" /> 
                <p className="text-gray-900 dark:text-white text-lg">Create New Note</p>
            </div>
            {notes.map(note => (
                <NoteCard key={note.id} note={note} updateNoteList={updateNoteList} />
            ))}
            {nextPageUrl && (
                <button onClick={handleLoadMore} className="bg-blue-500 size-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300 ease-in-out">
                    Load More
                </button>
            )}
        </div>
    );
};

export default NoteList;
