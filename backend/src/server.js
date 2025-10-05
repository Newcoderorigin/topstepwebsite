import http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createMarketRouter } from './routes/marketRoutes.js';
import { TopstepGatewayService } from './services/topstepGateway.js';
import { ContextStore } from './utils/contextStore.js';

const PORT = process.env.PORT ?? 4000;

const app = express();
app.use(cors());
app.use(express.json());

const gateway = new TopstepGatewayService({
  baseUrl: process.env.TOPSTEP_GATEWAY_URL,
  apiKey: process.env.TOPSTEP_GATEWAY_KEY,
  useMocks: process.env.USE_LIVE_GATEWAY !== 'true'
});
const contextStore = new ContextStore();

app.use('/api/markets', createMarketRouter({ gateway, contextStore }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', mode: gateway.useMocks ? 'mock' : 'live' });
});

app.use((err, _req, res, _next) => {
  console.error('backend error', err);
  res.status(500).json({ error: 'Internal Server Error', detail: err.message });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/api/markets/stream' });

wss.on('connection', (socket) => {
  let stream;

  socket.on('message', (message) => {
    try {
      const payload = JSON.parse(message.toString());
      if (payload.type === 'subscribe') {
        if (stream) {
          stream.stop?.();
          gateway.stopStream(stream);
        }
        stream = gateway.createStream(payload.symbols);
        stream.on('quote', (quote) => {
          if (socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify(quote));
          }
        });
        stream.start?.();
      }
    } catch (error) {
      socket.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });

  socket.on('close', () => {
    if (stream) {
      stream.stop?.();
      gateway.stopStream(stream);
      stream = undefined;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Topstep backend listening on port ${PORT}`);
});
