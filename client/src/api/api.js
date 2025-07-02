import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:5001/api/',
    withCredentials: true
})

export const API = {
    checkAuth: () => {
        return instance.get('auth/check')
            .then(response => response.data)
            .catch(err => err.response.data)
    }
}