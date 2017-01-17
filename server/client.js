var socket = require('socket.io-client')('http://localhost:7777');
socket.on('connect', () => console.log('connected'));
socket.on('users', (m) => console.log('>> %s', m));
socket.on('disconnect', () => console.log('connected'));
