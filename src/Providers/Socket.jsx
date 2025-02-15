import React, { useContext } from "react";
import { useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext();

export const useSocket = () =>{
    return useContext(SocketContext);
}

export const SocketProvider = ({children}) => {
    const socket = useMemo(()=> io({host: 'localhost', port: 8001}))
    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}