/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('yi-guitar-token');
    
    // Ép buộc tạo kết nối mới để cập nhật Token mới nhất (Fix lỗi đổi tài khoản)
    const newSocket = io(import.meta.env.VITE_BASE_URL, {
      auth: { token },
      forceNew: true, 
      reconnection: true,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    // eslint-disable-next-line
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
