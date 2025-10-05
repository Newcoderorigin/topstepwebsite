export class ContextStore {
  constructor() {
    this.sessions = new Map();
  }

  upsertSession(userId, payload) {
    const baseline = this.sessions.get(userId) ?? {
      userId,
      riskProfile: { maxDraw: 1500, dailyGoal: 800 },
      lastDecisions: []
    };
    const merged = {
      ...baseline,
      ...payload,
      lastUpdated: new Date().toISOString()
    };
    this.sessions.set(userId, merged);
    return merged;
  }

  appendDecision(userId, decision) {
    const session = this.sessions.get(userId);
    if (!session) {
      throw new Error('Session not found');
    }
    const next = {
      ...session,
      lastDecisions: [...session.lastDecisions.slice(-20), { ...decision, timestamp: new Date().toISOString() }]
    };
    this.sessions.set(userId, next);
    return next;
  }

  getSession(userId) {
    return this.sessions.get(userId) ?? null;
  }
}
