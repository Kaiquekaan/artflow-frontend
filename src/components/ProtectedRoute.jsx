import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN} from "../constants"
import { useState, useEffect } from "react"

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {   
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        if (!refreshToken) {
            setIsAuthorized(false);
            return;
          }

        try{
            const res = await api.post("/api/user/token/refresh/", 
                {refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                setIsAuthorized(true)
            }else{
                setIsAuthorized(false)
                localStorage.clear();
                <Navigate to="/login"/>
            }
            
        }catch (error) {
            console.log('Erro ao renovar token ', error)
            setIsAuthorized(false)
            localStorage.clear();
            <Navigate to="/login"/>
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)

        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if  (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true)
        }
    };

    useEffect(() => {
        auth().catch(() => {
          setIsAuthorized(false);
          localStorage.clear(); // Limpa os tokens inválidos
        });
      }, []);

    if (isAuthorized === null) {
        return <div className="loading-site"></div>
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;