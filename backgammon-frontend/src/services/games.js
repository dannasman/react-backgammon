/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'

const baseUrl = 'http://localhost:3000' //need to be changed

const game = (id) => {
    const request = axios.get(`${baseUrl}/game/${id}`)
    return request.then(response => response.data)
}

const start = (data) => {
    const request = axios.post(`${baseUrl}/start`, data)
    return request.then(response => response.data)
}

const join = (data) => {
    const request = axios.post(`${baseUrl}/join`, data)
    return request.then(response => response.data)
}


export default { start, game, join }