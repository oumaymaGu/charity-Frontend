const WebSocket = require('ws');  // Importation du module 'ws' pour WebSocket

// Crée un serveur WebSocket qui écoute sur le port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Quand un client se connecte au serveur WebSocket
wss.on('connection', (ws) => {
  console.log('Client connecté');

  // Quand le serveur reçoit un message d'un client
  ws.on('message', (message) => {
    console.log('Message reçu du client:', message);
  });

  // Envoi d'un message au client dès qu'il se connecte
  ws.send('Bonjour du serveur');
});

// Affiche un message dans la console pour indiquer que le serveur fonctionne
console.log('Le serveur WebSocket fonctionne sur ws://localhost:8080');
