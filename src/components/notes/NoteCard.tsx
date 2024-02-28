import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faThumbtack, faShare } from '@fortawesome/free-solid-svg-icons';
import { NOTES_ENDPOINT , GENERATE_AND_ACCESS_SHARED_NOTE_ENDPOINT } from '../../utils/constants';
import Cookies from 'js-cookie';
import fetcher from '../../services/api'; 

interface NoteCardProps {
    note: Note;
    updateNoteList: (deletedNoteId: number) => void;
    handlePinToggle: (noteId: number) => void; // Function to handle pin toggle
}

const NoteCard: React.FC<NoteCardProps> = ({ note, updateNoteList, handlePinToggle }) => {
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [shareLink, setShareLink] = useState('');

    const handleCardClick = () => {
        navigate(`/createnote`, { state: { noteData: note } });
    };

    const handlePinClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        // console.log("hello")
        note.id && handlePinToggle(note.id); // Call handlePinToggle function with note id
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        setConfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const accessToken = Cookies.get('accessToken');
            const response: any = await fetcher(`${NOTES_ENDPOINT}`, {
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
            note.id && updateNoteList(note.id);
            
        } catch (error) {
            console.error('Error deleting note:');
        }
    };



    const handleShareClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        try {
            // console.log(note)
            const accessToken = Cookies.get('accessToken');
            const response: any = await fetcher(`${GENERATE_AND_ACCESS_SHARED_NOTE_ENDPOINT}${note.id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
    
            if (!response.ok) {
                console.error('Failed to generate share link:', response.statusText);
                return;
            }
            
            const data = await response.json();
            // console.log(data)
            const shareableLink = `${window.location.origin}/public/${data.data.public_link}`;
            setShareLink(shareableLink);
        } catch (error) {
            console.error('Error generating share link:', error);
        }
    };

    const handleCopyClick = (e: any) => {
        e.stopPropagation();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareLink)
                .then(() => alert('Link copied to clipboard'))
                .catch((error) => console.error('Failed to copy link: ', error));
        } else {
            // Fallback for browsers that do not support navigator.clipboard
            const textArea = document.createElement('textarea');
            textArea.value = shareLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard');
        }
    };

    return (
        <div 
            className="w-1/4 p-6 mb-4 m-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer relative"
            onClick={handleCardClick}
            style={{ maxHeight: '50vh', maxWidth: '50vh' }}
        >
            <div className="overflow-y-hidden" style={{ maxHeight: 'calc(50vh - 100px)' }}>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                {note.title}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400 mb-3">
            {note.content ? extractDescription(note.content) : "No content available"}  
            </p>
           </div>
            <div className=" absolute bottom-0 right-0 mb-4 mr-4 p-3 flex items-center justify-center bg-white rounded-lg shadow" style={{ maxWidth: 'calc(100% - 24px)' }}>
                <div className="mr-4" onClick={handleShareClick}>
                    <FontAwesomeIcon icon={faShare} className="cursor-pointer text-xl text-blue-500" />
                </div>
                <div className="mr-4" onClick={handlePinClick}>
                    <FontAwesomeIcon icon={faThumbtack} className={`cursor-pointer text-xl ${note.is_pinned ? 'text-blue-500' : 'text-gray-500'}`} />
                </div>
                <div className="mr-4" onClick={handleDeleteClick}>
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
             {shareLink && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center" onClick={() => setShareLink('')}>
                <div className="bg-white p-4 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-lg text-gray-900">Share Link:</p>
                        <button onClick={() => setShareLink('')} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <input type="text" value={shareLink} className="w-full mb-2" readOnly />
                    <button onClick={handleCopyClick} className="bg-blue-500 text-white px-4 py-2 rounded">Copy</button>
                </div>
            </div>
)}
        </div>
    );
};

function extractDescription(content: ContentItem[] | undefined) { 
    const text = (content ?? []).reduce((text, item) => { // Handle potential undefined
          if (typeof item.insert === 'string') {
              return text + item.insert;
          } else {
              return text;
          }
      }, '');
      return text.slice(0, 500) + '...';
}

export default NoteCard;
