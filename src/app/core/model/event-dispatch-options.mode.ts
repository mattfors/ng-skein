
export interface DispatchOptions {
  /** Override timestamp (ms since epoch). Defaults to Date.now() */
  ts?: number;
  /** Who triggered it */
  actorId?: string;
  /** Where it came from: 'ui' | 'effect' | 'sync' | 'import' */
  source?: string;
  /** Force a correlation id. If omitted, inherits from cause or a new one is created */
  correlationId?: string;
  /**
   * Prior event info to link causation and inherit correlation id if not provided.
   * Pass at least { id }. correlationId is optional; if omitted we try to read it from the prior event's meta.
   */
  cause?: { id: string; correlationId?: string };
}
