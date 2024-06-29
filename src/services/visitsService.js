import { UNSECURE_ENDPOINT } from "../utils/endpoints.js";

export default {
  async getUserVisits(id, page) {
    try {
      const response = await fetch(
        `${UNSECURE_ENDPOINT}/users/${id}/restaurants/visits?page=${page.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to get user's visits`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },
  async getUserVisitsTotal(id) {
    try {
      const response = await fetch(
        `${UNSECURE_ENDPOINT}/users/${id}/restaurants/visits?limit=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to get user's visits total`);
      }
      const data = await response.json();
      return data.total;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },
  async getUserVisitsAtRestaurant(userId, restaurantId) {
    try {
      const response = await fetch(
        `${UNSECURE_ENDPOINT}/users/${userId}/restaurants/${restaurantId}/visits`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to get restaurant visits by id`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },

  async addUserVisitsAtRestaurant(userId, restaurantId, comment, rating, date) {
    try {
      const response = await fetch(
        `${UNSECURE_ENDPOINT}/users/${userId}/restaurants/visits`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            restaurant_id: restaurantId,
            comment: comment,
            rating: rating,
            date: date,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to add to visited`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  },
};
