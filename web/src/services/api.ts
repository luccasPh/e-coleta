import axios from 'axios'

const api = axios.create({
    baseURL: "https://server-ec.herokuapp.com"
})

export default api;