import { NextRequest } from 'next/server';
import { WebSocketServer } from 'ws';
import { parse } from 'url';

const wss = new WebSocketServer({ noServer: true });

// export function GET(req: NextRequest) {
//   if (!req.socket.server.ws) {
//     req.socket.server.ws = wss;
//   }

//   wss.on('connection', (ws, request) => {
//     const { pathname } = parse(request.url!, true);
//     const roomId = pathname?.split('/').pop();

//     ws.on('message', (message) => {
//       // Broadcast to all clients in the same room
//       wss.clients.forEach((client) => {
//         if (client !== ws) {
//           client.send(message.toString());
//         }
//       });
//     });
//   });

//   return new Response(null, {
//     status: 101,
//     headers: {
//       'Upgrade': 'websocket',
//     },
//   });
// } 