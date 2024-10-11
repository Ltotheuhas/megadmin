import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const fetchObjects = async () => {
    try {
        console.log(`Attempting to fetch from: ${apiUrl}/objects`); // Log the full URL

        const response = await fetch(`${apiUrl}/objects`);
        console.log('Response received:', response); // Log the full response object

        if (!response.ok) {
            console.error(`Response status error: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        console.log('Response content-type:', contentType); // Log the content-type to ensure it's JSON

        if (!contentType || !contentType.includes('application/json')) {
            console.error('Expected JSON response but got:', contentType);
            throw new Error('Response is not JSON');
        }

        const data = await response.json();
        console.log('Fetched objects:', data); // Log the parsed JSON data
        return data;
    } catch (error) {
        console.error('Error occurred during fetch:', error); // Log the error with additional context
        throw error;
    }
};

export const fetchObjectById = async (id) => {
    try {
        const response = await fetch(`${apiUrl}/objects/${id}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching object by ID:', error);
        throw error;
    }
};

export const updateObject = async (id, updatedData) => {
    const response = await fetch(`${apiUrl}/objects/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    });
    return response.json();
};

export const deleteObject = async (id) => {
    try {
        await axios.delete(`${apiUrl}/objects/${id}`);
    } catch (error) {
        console.error('Error deleting object:', error);
        throw error;
    }
};

// Add other functions as needed (e.g., for updating or editing objects)
