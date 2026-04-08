Data model proposals — Fatigue, Progression, Expected PR

Overview
These models are minimal, extend the existing schema, and are designed for analytics and simple ML features (Coach IA). They are intentionally denormalized and append-only for auditability.

Models added

- `Fatigue`
  - Purpose: store per-user recovery score (0..1) sampled over time. Can be computed from sleep, HRV, recent training load, and subjective input.
  - Use cases: day-of recommendations (reduce volume), push-notifications for rest, coach insights.

- `ProgressionSlope`
  - Purpose: store computed trend over a timeframe for a given metric (e.g., 1RM, weekly volume).
  - Use cases: detect plateaus, trigger suggestions (deload, vary intensity), feed into UI charts.

- `ExpectedPR`
  - Purpose: predicted PR (1RM or other metric) with a target date and confidence.
  - Use cases: show achievable goals in the coach UI, drive motivation and program recommendations.

Implementation notes

- These models are append-only (createdAt) to retain history; updates should create new rows.
- Sizing: expect low write volume (one per user per day/week depending on frequency).
- Storage/cost: fields are lightweight (floats + timestamps), unlikely to materially affect DB costs.

Next steps

1. Create a small service `analyticsService` that:
   - Computes fatigue heuristically (recent volume, session RPE, sleep input).
   - Computes progression slopes (linear regression over sample window).
   - Produces ExpectedPR using heuristic or lightweight model.
2. Create scheduled job (daily) to compute and persist these values.
3. Expose endpoints for frontend to fetch latest fatigue and predictions.
4. Add tests for analytics logic and contract tests for new endpoints.

If you want, I can implement the analytics service skeleton and scheduled job next.
