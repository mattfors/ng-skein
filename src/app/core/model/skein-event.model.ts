import { EventMeta } from './event-meta.model';

export interface SkeinEvent<TType extends string = string, TPayload = unknown> {
  type: TType;
  payload?: TPayload;
  meta?: EventMeta;
}
