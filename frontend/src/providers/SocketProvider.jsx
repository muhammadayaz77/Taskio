import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { getToken } from "../utils/tokenStorage";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [connected, setConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(() => new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user?._id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    const token = getToken();
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 800,
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("presence:online", ({ userId }) =>
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.add(String(userId));
        return next;
      })
    );
    socket.on("presence:offline", ({ userId }) =>
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(String(userId));
        return next;
      })
    );

    socketRef.current = socket;
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
      setOnlineUserIds(new Set());
    };
  }, [isAuthenticated, user?._id]);

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      connected,
      onlineUserIds,
      hydrateOnline: (ids = []) =>
        setOnlineUserIds(new Set(ids.map(String))),
    }),
    [connected, onlineUserIds]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    return { socket: null, connected: false, onlineUserIds: new Set() };
  }
  return ctx;
}
