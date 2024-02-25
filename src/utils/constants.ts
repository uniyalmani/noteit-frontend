// src/utils/constants.ts
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api/'; 
export const SIGNIN_ENDPOINT = 'auth/login/';
export const SIGNUP_ENDPOINT = 'auth/signup/';
export const NOTES_ENDPOINT = 'notes/';
export const CREATE_NOTE_ENDPOINT = 'notes/createnote/';
export const TOGGLE_PIN_ENDPOINT = 'notes/togglepin/';

export const MAX_SAVE_ATTEMPTS = 3;