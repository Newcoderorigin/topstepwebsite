# Quant Trading Bot Interface (Design Draft)

## Objectives
- Deliver futures-only trade recommendations with a targeted hit rate of **55–61%**.
- Provide auditable backtesting hooks and live performance telemetry.
- Integrate with the TopstepX Gateway data service for consistent market context.

## Module Overview
```
QuantBotService
├── configure(params: QuantBotConfig)
├── requestSignals(request: SignalRequest): Promise<SignalBatch>
├── registerBacktestRun(params: BacktestConfig): AsyncIterable<BacktestResult>
└── logPerformance(event: PerformanceEvent): void
```

### Types
- `QuantBotConfig`
  - `strategyId: string` – unique identifier for the algorithm.
  - `riskModel: 'conservative' | 'balanced' | 'aggressive'` – toggles guardrails.
  - `maxConcurrentPositions: number` – trade concurrency cap.
  - `instruments: InstrumentSymbol[]` – allowed futures symbols.
  - `hitRateTarget: [0.55, 0.61]` – enforced target band.
  - `slippageBps: number` – assumed slippage.
  - `dataFeed: DataFeedHandle` – handle produced by the data service layer.

- `SignalRequest`
  - `userId: string`
  - `timeframe: '1m' | '5m' | '15m' | '1h'`
  - `contextId: string` – references the ContextStore snapshot.
  - `riskOverrides?: Partial<RiskParameters>`

- `SignalBatch`
  - `generatedAt: string`
  - `signals: TradeSignal[]`
  - `confidence: number` – aggregated probability of success.
  - `hitRateWindow: PerformanceWindow` – trailing stats for 20, 50, 100 trade windows.

- `TradeSignal`
  - `symbol: InstrumentSymbol`
  - `direction: 'long' | 'short'`
  - `entry: number`
  - `stop: number`
  - `target: number`
  - `confidence: number`
  - `timeInForce: 'DAY' | 'GTC'`
  - `rMultiple: number`

- `BacktestConfig`
  - `symbol: InstrumentSymbol`
  - `start: string`
  - `end: string`
  - `timeframe: string`
  - `parameters: Record<string, number | string>`

- `BacktestResult`
  - `timestamp: string`
  - `equityCurve: number`
  - `drawdown: number`
  - `hitRate: number`
  - `trades: number`

- `PerformanceEvent`
  - `userId: string`
  - `contextId: string`
  - `signalId: string`
  - `outcome: 'win' | 'loss' | 'breakeven'`
  - `rMultiple: number`
  - `latencyMs: number`

## Backtesting Hooks
- **Streaming backtests:** `registerBacktestRun` yields incremental equity snapshots to support UI timelines.
- **Data alignment:** uses the same `DataFeedHandle` as live mode to ensure indicator parity.
- **Reproducibility:** every backtest run logs a deterministic seed and configuration hash.

## Performance Logging
- Append `PerformanceEvent` instances to the ContextStore `lastDecisions` queue.
- Persist aggregated hit rate metrics across rolling windows (20/50/100 trades).
- Emit structured logs to `logs/performance.log` (future work) with JSON lines for downstream analytics.

## Integration Notes
- Signals consumed by the frontend should include a `confidence` metric and `hitRateWindow` band to visually indicate adherence to the 55–61% goal.
- Risk controls must reject signals that violate user-specific `riskBudget` or `dailyDrawLimit` from the ContextStore profile.
- Future iterations may introduce reinforcement learning loops; ensure interfaces remain stateless between calls aside from explicit `configure` and logging methods.
