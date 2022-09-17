import axios from 'axios'
import env from '../../env'

export const deleteImage = (public_id) => {
    return axios.delete(env.API+'/api/delete/image/'+public_id)
}