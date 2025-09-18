import { EventMeta } from './event-meta.model';

export interface SkeinEvent<TType = string, TPayload = Record<string, unknown>> {
  type: TType;
  payload?: TPayload;
  meta?: EventMeta;
}
