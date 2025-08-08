export interface EventMeta {
  ts: number;
  actorId?: string;
  source?: string;
  correlationId?: string;
  causationId?: string;
}
