import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
  autoConnect: false,
});

socket.on('connect', () => console.log('Socket connected'));
socket.on('connect_error', (err) => console.error('Socket connection error:', err));

export default socket;