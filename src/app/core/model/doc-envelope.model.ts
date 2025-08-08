/**
 * Wraps a domain object with PouchDB metadata for storage.
 */
export interface DocEnvelope<TData = unknown> {
  /** Required unique document identifier */
  _id: string;
  /** Optional revision token for conflict resolution */
  _rev?: string;
  /** Domain data payload */
  data: TData;
}
