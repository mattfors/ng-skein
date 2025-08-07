export interface DocEnvelope<T = any> {
  _id: string;
  _rev?: string;
  data: T;
}
