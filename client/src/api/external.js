import axios from 'axios';

const api = axios.create({
    baseURL: '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


