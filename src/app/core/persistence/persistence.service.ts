import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { DocEnvelope } from '../model/doc-envelope.model';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  private db = new PouchDB('skein');

  put<T>(doc: DocEnvelope<T>): Observable<PouchDB.Core.Response> {
    return from(this.db.put(doc));
  }

  get<T>(id: string): Observable<DocEnvelope<T>> {
    return from(this.db.get<DocEnvelope<T>>(id));
  }

  remove<T>(doc: DocEnvelope<T>): Observable<PouchDB.Core.Response> {
    if (!doc._rev) {
      throw new Error(`_rev is required to remove document ${doc._id}`);
    }
    return from(this.db.remove(doc as PouchDB.Core.RemoveDocument));
  }

  allDocs<T>(opts: PouchDB.Core.AllDocsOptions = {}): Observable<PouchDB.Core.AllDocsResponse<DocEnvelope<T>>> {
    return from(this.db.allDocs<DocEnvelope<T>>({ ...opts, include_docs: true }));
  }

  changes<T>(): Observable<PouchDB.Core.ChangesResponseChange<DocEnvelope<T>>> {
    return new Observable((subscriber) => {
      const changes = this.db
        .changes<DocEnvelope<T>>({
          live: true,
          include_docs: true,
        })
        .on('change', (change) => subscriber.next(change))
        .on('error', (err) => subscriber.error(err));

      return () => changes.cancel(); // teardown logic
    });
  }

}
