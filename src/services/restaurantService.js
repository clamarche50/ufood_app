import { UNSECURE_ENDPOINT } from '../utils/endpoints.js';

export default {
    async getRestaurant(id) {
        try {
            const response = await fetch(`${UNSECURE_ENDPOINT}/restaurants/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to get restaurant by id`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    },
    
    async searchRestaurant(searchTerm, max) {
        try {
            const response = await fetch(`${UNSECURE_ENDPOINT}/restaurants?q=${searchTerm}&limit=${max}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to search restaurant`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    },
}