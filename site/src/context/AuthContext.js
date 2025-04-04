'use client'
import { createContext,useContext,useState } from "react";

const AuthContext = createContext()

export function AuthProvider({children}){
    const [authData, setAuthData] = useState({
        user:null,
        scholl:null,
        isAuthenticated:false
    })

    const login = (userData, schoolData) =>{
        setAuthData({user:userData,school:schoolData,isAuthenticated:true})
    }

    const logout = ()=>{
        setAuthData({user:null,school:null,isAuthenticated:false})
    }

    return (
        <AuthContext.Provider value={{...authData,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}