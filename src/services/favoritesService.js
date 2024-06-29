import { UNSECURE_ENDPOINT } from '../utils/endpoints.js';

export default {
    async postFavorite(owner, name) {
        try {
            const response = await fetch(`${UNSECURE_ENDPOINT}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    name: name,
                    owner: owner
                })
            })

            if (!response.ok) {
                throw new Error(`Failed to post new favorite list`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    },
    
    async putFavorite(owner, id, name) {
        try {
            const response = await fetch(`${UNSECURE_ENDPOINT}/favorites/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    name: name,
                    owner: owner
                })
            })

            if (!response.ok) {
                throw new Error(`Failed to update favorite list`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    },

    async addToFavorite(id, restaurantId) {
        try {
            const response = await fetch(`${UNSECURE_ENDPOINT}/favorites/${id}/restaurants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    id: restaurantId
                })
            })

            if (!response.ok) {
                throw new Error(`Failed to add to favorite list`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    },

    async deleteToFavorite(id, restaurantId) {
        try {
            const response = await fetch(`${UNSECURE_ENDPOINT}/favorites/${id}/restaurants/${restaurantId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to delete restaurant in the list`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    },

    async deleteFavorite(id) {
        try {
            const response = await fetch(`${UNSECURE_ENDPOINT}/favorites/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to delete favorite list`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error:', error.message)
            throw error
        }
    },
}