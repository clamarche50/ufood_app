import { SECURE_ENDPOINT } from '../utils/endpoints.js';
import Cookies from 'js-cookie' //https://github.com/js-cookie/js-cookie
import { jwtDecode } from "jwt-decode"; //https://www.npmjs.com/package/jwt-decode
const COOKIE_NAME = "AuthTokenUFood"

export default {
  async login(email, password) {
    try {
      const response = await fetch(`${SECURE_ENDPOINT}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            email: email,
            password: password
        })
      })

      if (response.status === 401) {
        throw new Error('Unauthorized access. Please check your credentials.');
      } else if (!response.ok) {
        throw new Error('Failed to login');
      }
      
      const data = await response.json()
      const decoded = jwtDecode(data.token)
      const expirationDate = new Date(decoded.exp * 1000)

      Cookies.set(COOKIE_NAME, data.token, { expires: expirationDate })
      return data.id
    } catch (error) {
      console.error('Error logging in:', error.message)
      throw error
    }
  },

  async signup(name, email, password) {
    try {
      const response = await fetch(`${SECURE_ENDPOINT}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            name: name,
            email: email,
            password: password
        })
      })

      if (!response.ok) {
        throw new Error('Failed to signup');
      }
      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('Error during signup:', error.message)
      throw error
    }
  },

  async tokenInfo() {
    if(!this.isAuthenticated()) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await fetch(`${SECURE_ENDPOINT}/tokenInfo`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.getUserToken()
          }
      })

      if (!response.ok) {
        throw new Error('Failed to get tokenInfo');
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error getting token info:', error.message)
      throw error
    }
  },

  async logout() {
    // log out not working on api??????????
    Cookies.remove(COOKIE_NAME)
  },

  isAuthenticated() {
    return Cookies.get(COOKIE_NAME) != undefined
  },

  getUserToken() {
    if(this.isAuthenticated()) {
      return Cookies.get(COOKIE_NAME)
    }
    return null
  },

  async getUserId() {
    const info = await this.getLoggedUser()
    if(info != null) {
      return info.id
    }
    return null
  },

  async getLoggedUser() {
    try {
      const info = await this.tokenInfo()
      return info
    } catch (error) {
      return null
    }
  }
}