import ReconnectingWebSocket from "reconnecting-websocket";
import { useDispatch } from "react-redux";
import { addTask, updateTask, deleteTask } from "./store/tasksSlice";

let socket = null;


export const connectWebSocket = (token) => {

  if (socket) {
    socket.close();
  }

  const wsUrl = `${import.meta.env.VITE_WS_URL}${token}`;

  // const wsUrl = `ws://127.0.0.1:8001/ws/tasks/?token=${token}`;

  console.log("Attempting to connect WebSocket at:");

  socket = new ReconnectingWebSocket(wsUrl);

  socket.onopen = () => {
    console.log("WebSocket connected successfully");
  };

  socket.onmessage = (event) => {
    console.log("WebSocket message received:", event.data);
    try {
      const data = JSON.parse(event.data);
      console.log("Parsed WebSocket data:", data);

     
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  socket.onclose = (event) => {
    console.log(
      "WebSocket disconnected. Code:",
      event.code,
      "Reason:",
      event.reason
    );
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
};

export const disconnectWebSocket = () => {
  if (socket) {
    console.log("Closing WebSocket connection");
    socket.close();
  }
};
