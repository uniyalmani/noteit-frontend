import { API_BASE_URL } from '../utils/constants';

const fetcher = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${url}`, options);


    return response as T; // Parse JSON and cast to the desired type
};

export default fetcher;
