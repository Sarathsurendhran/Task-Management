import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import { connectWebSocket, disconnectWebSocket } from './websocket';
import { taskUpdated } from './store/tasksSlice';
import Footer from './components/Footer';

function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let socket;
    if (token) {
      console.log('Token available, connecting WebSocket');
      socket = connectWebSocket(token);
      socket.onmessage = (event) => {
        console.log('WebSocket message received in App:', event.data);
        try {
          const data = JSON.parse(event.data);
          console.log('Parsed WebSocket data:', data);
          dispatch(taskUpdated(data));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } else {
      console.log('No token available, not connecting WebSocket');
    }

    return () => {
      if (socket) {
        console.log('Cleaning up WebSocket connection');
        disconnectWebSocket();
      }
    };
  }, [token, dispatch]);

  return (
    <Router>
      <Toaster position="top-right" />
      {token && <Header />}
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;