import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useCookies } from 'react-cookie'
import { useJwt, decodeToken } from 'react-jwt'
import axios from 'axios'
import env from '../env'

export const DataWebContext = createContext()

function DataWebProvider(props) {

    const [cookies, setCookies, removeCookies] = useCookies()
    const [permisos, setPermisos] = useState({});
    const [rol, setRol] = useState('');
    const [accesos, setAccesos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        user:"",
        img:"",
        email:""
    })

    const verific = (ruta) => {
        if (accesos[0] !== '/') {
            return accesos.includes(ruta)
        }
        return true
    }

    const isLogin = () => {
        if (cookies.token) {
            return cookies.token
        }
        if (sessionStorage.getItem('token')) {
            return sessionStorage.getItem('token')
        }
        return false
    }

    const setToken = (t, locked) => {
        if (locked) {
            setCookies('token', t)
        }
        else {
            sessionStorage.setItem('token', t)
        }
    }

    const getToken = () => {
        if (cookies.token) {
            return cookies.token
        }
        else {
            return sessionStorage.getItem('token')
        }
    }

    const load = () => {
        setLoading(true)    
        const tok = decodeToken(getToken())
        if (tok) {
            axios.get(`${env.API}/api/getuser/${tok._id}`).then(async ({data})=>{
                const token = decodeToken(data.token)
                console.log(token)
                setUser(token)
                setPermisos(token.role.permisos)
                setAccesos(token.role.accesos)
                setRol(token.nombre)
                setLoading(false)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    const logOut = () => {
        if (cookies.token) {
            removeCookies('token')
        }
        else {
            sessionStorage.removeItem('token')
        }   
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <DataWebContext.Provider value={{ loading, logOut, isLogin, setToken, getToken, rol, setRol, permisos, setPermisos, verific, load, user }}>
            {props.children}
        </DataWebContext.Provider>
    );
}

export default DataWebProvider;