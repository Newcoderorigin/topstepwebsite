import express from 'express';
import { TopstepGatewayService } from '../services/topstepGateway.js';

export function createMarketRouter({ gateway, contextStore }) {
  const router = express.Router();
  const service = gateway ?? new TopstepGatewayService({ useMocks: true });

  router.get('/symbols', (_req, res) => {
    res.json({ symbols: service.listFuturesSymbols() });
  });

  router.post('/snapshot', async (req, res, next) => {
    try {
      const { symbols } = req.body;
      const snapshot = await service.fetchSnapshot(symbols);
      res.json(snapshot);
    } catch (error) {
      next(error);
    }
  });

  router.post('/context', (req, res) => {
    const { userId = 'demo-user', profile } = req.body;
    const nextProfile = contextStore.upsertSession(userId, profile ?? {});
    res.json(nextProfile);
  });

  router.post('/decision', (req, res, next) => {
    try {
      const { userId = 'demo-user', decision } = req.body;
      const session = contextStore.appendDecision(userId, decision);
      res.json(session);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
