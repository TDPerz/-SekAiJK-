import axios from "axios"
import env from '../../env'

export const getRole = async (role) => {
    return await axios.get(`${env.API}/api/role/${role}`)
}

export const getRoles = async () => {
    return axios.get(`${env.API}/api/role`)
}


export const createRole = async () => {
    return axios.post(`${env.API}/api/role`)
}