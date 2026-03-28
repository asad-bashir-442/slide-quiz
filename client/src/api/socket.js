import { io } from "socket.io-client";
import { BASE_URL } from "../utility/env";

export const socket = io(BASE_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  path: "/socket.io/",
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
