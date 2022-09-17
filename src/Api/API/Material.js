import env from '../../env'
import axios from 'axios'

export const getMaterials = () => {
    return axios.get(`${env.API}/api/material`)
}

export const postMaterial = (data) => {
    return axios.post(`${env.API}/api/material`, data)
}