import axios from 'axios'

const BASE_URL = 'https://your-backend-url.com/api'  // 백엔드 주소로 변경

export const login = async (id, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      id,
      password
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}