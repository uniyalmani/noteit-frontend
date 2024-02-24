import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

interface NoteCardProps {
    note: Note;
    updateNoteList: (deletedNoteId: number) => void;
    handlePinToggle: (noteId: number) => void; // Function to handle pin toggle
}

const NoteCard: React.FC<NoteCardProps> = ({ note, updateNoteList, handlePinToggle }) => {
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const handleCardClick = () => {
        navigate(`/createnote`, { state: { noteData: note } });
    };

    const handlePinClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        console.log("hello")
        handlePinToggle(note.id); // Call handlePinToggle function with note id
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        setConfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await fetch(`http://127.0.0.1:8000/api/notes/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ noteId: note.id })
            });

            if (!response.ok) {
                console.error('Failed to delete note:', response.statusText);
                return;
            }

            setConfirmDelete(false);
            updateNoteList(note.id); // Update note list after successful deletion
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <div 
            className="w-1/4 p-6 mb-4 m-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer relative"
            onClick={handleCardClick}
            style={{ maxHeight: '50vh', maxWidth: '50vh' }}
        >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                {note.title}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400 mb-3">
                {extractDescription(note.content)} 
            </p>
            <div className="absolute bottom-0 right-0 mb-2 mr-2">
                <div className="mr-4 m-4" onClick={handlePinClick}>
                    <FontAwesomeIcon icon={faThumbtack} className={`cursor-pointer text-xl ${note.is_pinned ? 'text-blue-500' : 'text-gray-500'}`} />
                </div>
                <div className="mr-4 m-4" onClick={handleDeleteClick}>
                    <FontAwesomeIcon icon={faTrash} className="cursor-pointer text-xl text-red-500" />
                </div>
            </div>
            {confirmDelete && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center" onClick={() => setConfirmDelete(false)}>
                    <div className="bg-white p-4 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <p className="text-lg text-gray-900 mb-2">Are you sure you want to delete this note?</p>
                        <div className="flex justify-end">
                            <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Delete</button>
                            <button onClick={() => setConfirmDelete(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function extractDescription(content: ContentItem[]) { 
    const text = content.reduce((text, item) => {
        if (typeof item.insert === 'string') {
            return text + item.insert;
        } else {
            return text;
        }
    }, '');
    return text.slice(0, 200) + '...';
}

export default NoteCard;
