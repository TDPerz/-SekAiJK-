import axios from 'axios'
import env from '../../env'

// TODO: Hacer que pida pediticones del role para que este actualizado
export const login = (value)=>{
    return axios.post(env.API + '/api/login', value)
}