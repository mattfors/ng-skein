/**
 * Hierarchical namespace used to categorize persisted events.
 */
export interface EventScope {
  /** Primary domain (e.g., "picking") */
  domain: string;
  /** Optional subdomain (e.g., "picklist") */
  subdomain?: string;
  /** Optional unique instance (e.g., document ID) */
  context?: string;
  /** Optional nested scope within the context */
  subcontext?: string;
}
