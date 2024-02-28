import  { useState, useEffect } from 'react';
import NoteCard from "./NoteCard";
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';
import fetcher from '../../services/api';   
import { NOTES_ENDPOINT , TOGGLE_PIN_ENDPOINT} from '../../utils/constants';
import Cookies from 'js-cookie';

const NoteList: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const navigate = useNavigate();
    const { refreshAccessToken, logout } = useAuth();
    const location = useLocation();
    // const [refreshingToken] = useState(false); 
    const [successMessage, setSuccessMessage] = useState(location.state && location.state.successMessage)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(()  => {
        let refreshCounter = 0;
        const fetchNotes = async () => {
            try {
                const accessToken = Cookies.get('accessToken');
                // console.log(accessToken)
                const response: any = await fetcher(`${NOTES_ENDPOINT}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
        
                if (!response.ok) {
                    if (response.status === 401 ) {
                        try {
                            await refreshAccessToken();
                            refreshCounter += 1;
                        } catch (error) {
                            console.error('Failed to refresh token:', error);
                        }
                    } else {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.message || `Request failed with status: ${response.status}`
                        );
                    }
                }
        
                const data = await response.json();
                // console.log(data)
                setNotes(data.data.results || []);
                setSuccessMessage(null);
                setNextPageUrl(data.next);
            } catch (error:any) {
                setErrorMessage(error)
                console.error('Error fetching notes data:', error);
            }
        };

        
       
        
        const attemptFetchWithRefresh = async () => {
            await fetchNotes();
    
            if (refreshCounter === 1) {
                await fetchNotes(); // Retry after refresh
            }
    
            if (refreshCounter === 2) {
                logout()
                console.log("Refresh token expired");
            }
        };
    
        // Initial attempt
        attemptFetchWithRefresh(); 
        
        
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
        } catch (error:any) {
            // console.error('Error fetching next page of notes:', error);
            setErrorMessage(error)
        }
    };

    // Function to handle pin toggle
    // Function to handle pin toggle
const handlePinToggle = async (noteId: number) => {
    try {
        console.log("called")
        const accessToken = Cookies.get('accessToken');
        const response: any = await fetcher(`${TOGGLE_PIN_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ noteId: noteId })
        });
    

        if (response.ok) {
            // Update the pinned status of the corresponding note
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note.id === noteId ? { ...note, is_pinned: !note.is_pinned } : note
                )
            );
        } else {
            // console.error('Failed to toggle pin:', response.statusText);
            setErrorMessage('Failed to toggle pin:')
        }
    } catch (error) {
        // console.error('Error toggling pin:', error);
        setErrorMessage('Error toggling pin:')
    }
};


    return (
        <>
        {successMessage && (
                <div className="bg-green-200  w-full text-center text-green-800">
                    {successMessage}
                </div>
            )}
        <div className="flex flex-wrap justify-center h-screen overflow-auto dark:bg-gray-900">
            <div
                className="w-1/4 p-6 mb-4 m-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer flex flex-col items-center justify-center"
                onClick={handleCreateNewNote}
                style={{ maxHeight: '50vh', maxWidth: '50vh' }}
            >
                <FontAwesomeIcon icon={faPlus} size="4x" color='white' className="mb-2" /> 
                <p className="text-gray-900 dark:text-white text-lg">Create New Note</p>
            </div>
            {/* Display pinned notes first */}
            {notes.filter(note => note.is_pinned ).map(note => (
                <NoteCard key={note.id} note={note} updateNoteList={updateNoteList} handlePinToggle={handlePinToggle} />
            ))}
            {/* Display other notes */}
            {notes.filter(note => !note.is_pinned).map(note => (
                <NoteCard key={note.id} note={note} updateNoteList={updateNoteList} handlePinToggle={handlePinToggle} />
            ))}
            {nextPageUrl && (
                <button onClick={handleLoadMore} className="bg-blue-500 size-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300 ease-in-out">
                    Load More
                </button>
            )}
        </div>
        </>
    );
};

export default NoteList;
