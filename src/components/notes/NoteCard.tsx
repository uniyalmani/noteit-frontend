import React from 'react';
import { useNavigate } from 'react-router-dom';


interface NoteCardProps {
    note: Note; // Update the prop type
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        console.log(note)
        navigate(`/createnote`, { state: { noteData: note } }); 
    };

    return (
        <div 
            className="w-1/4 p-6 mb-4 m-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
            onClick={handleCardClick}
        >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {note.title}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {extractDescription(note.content)} 
            </p>
        </div>
    );
};


function extractDescription(content: ContentItem[]) { 
    const text = content.reduce((text, item) => {
        if (typeof item.insert === 'string') {
            return text + item.insert;
        } else {
            return text; // Ignore images for now
        }
    }, '');
    return text.slice(0, 50) + '...';
}

export default NoteCard;
