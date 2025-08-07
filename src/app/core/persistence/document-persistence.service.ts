import { Injectable } from '@angular/core';
import { PersistenceService } from './persistence.service';
import { filter, map } from 'rxjs/operators';
import { DocEnvelope } from '../model/doc-envelope.model';

@Injectable({ providedIn: 'root' })
export class DocumentPersistenceService {
  constructor(private persistence: PersistenceService) {}

  get<T>(prefix: string, id: string) {
    return this.persistence.get<T>(`${prefix}:${id}`);
  }

  put<T>(prefix: string, id: string, data: T) {
    return this.persistence.put({
      _id: `${prefix}:${id}`,
      data
    });
  }

  remove<T>(prefix: string, id: string, rev: string) {
    return this.persistence.remove<T>({
      _id: `${prefix}:${id}`,
      _rev: rev,
      data: {} as T
    });
  }

  watch<T>(prefix: string, id: string, callback: (doc: T) => void) {
    const fullId = `${prefix}:${id}`;
    return this.persistence.changes().pipe(
      filter(change => change.id === fullId && !!change.doc?.data),
      map(change => (change.doc as DocEnvelope<T>).data)
    ).subscribe(callback);
  }
}
