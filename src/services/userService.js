import { SECURE_ENDPOINT } from '../utils/endpoints.js';
import auth from '@/services/authService.js';

export default {
    async getUser(id) {
        const token = auth.getUserToken()
        if(token == null) {
            throw new Error('Cant find user token')
        }

        try {
            const response = await fetch(`${SECURE_ENDPOINT}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': token
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to get user's information`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    },

    async getUserFavorites(id, page) {
        const token = auth.getUserToken()
        if(token == null) {
            throw new Error('Cant find user token')
        }
        try {
            const response = await fetch(`${SECURE_ENDPOINT}/users/${id}/favorites?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': token
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to get user's favorites`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    },

    async getUserNbFavorites(id) {
        const token = auth.getUserToken()
        if(token == null) {
            throw new Error('Cant find user token')
        }
        try {
            const response = await fetch(`${SECURE_ENDPOINT}/users/${id}/favorites?limit=1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': token
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to get user's number of favorites`)
            }
            const data = await response.json()
            return data.total
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    }
}