import { Injectable, OnDestroy, signal } from '@angular/core';
import {
  ref,
  onValue,
  push,
  set,
  update as rtdbUpdate,
  remove,
  get,
  DataSnapshot,
  Unsubscribe
} from 'firebase/database';
import { db } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class RealtimeCollectionService<T extends { id?: string } = Record<string, any>>
  implements OnDestroy {
  private tableName!: string;
  private unsubscribe?: Unsubscribe;

  readonly results = signal<T[]>([]);
  readonly isPending = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  init(tableName: string): this {
    this.tableName = tableName;
    this.startListener();
    return this;
  }

  private handleSnapshot(snapshot: DataSnapshot): T[] {
    if (!snapshot.exists()) {
      this.results.set([]);
      this.isPending.set(false);
      return [];
    }

    const data = Object.entries(snapshot.val()).map(([id, value]) => ({
      id,
      ...(value as object)
    })) as T[];

    this.results.set(data);
    this.isPending.set(false);
    return data;
  }

  private startListener(): void {
    this.unsubscribe?.();
    this.isPending.set(true);
    this.error.set(null);

    try {
      const dbRef = ref(db, this.tableName);
      this.unsubscribe = onValue(
        dbRef,
        (snapshot) => this.handleSnapshot(snapshot),
        (err) => {
          this.error.set(err.message);
          this.isPending.set(false);
        }
      );
    } catch (err: any) {
      this.error.set(err.message);
      this.isPending.set(false);
    }
  }

  async getAll(): Promise<T[]> {
    this.isPending.set(true);
    this.error.set(null);

    try {
      const snapshot = await get(ref(db, this.tableName));
      return this.handleSnapshot(snapshot);
    } catch (err: any) {
      this.error.set(err.message);
      this.isPending.set(false);
      return [];
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }

  async add(data: Omit<T, 'id'>): Promise<string> {
    this.isPending.set(true);
    this.error.set(null);

    try {
      const nodeRef = ref(db, this.tableName);
      const newRef = push(nodeRef);
      await set(newRef, data);
      this.isPending.set(false);
      return newRef.key || '';
    } catch (err: any) {
      this.error.set(err.message);
      this.isPending.set(false);
      throw err;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    this.isPending.set(true);
    this.error.set(null);

    try {
      const itemRef = ref(db, `${this.tableName}/${id}`);
      await rtdbUpdate(itemRef, data as Record<string, any>);
      this.isPending.set(false);
    } catch (err: any) {
      this.error.set(err.message);
      this.isPending.set(false);
      throw err;
    }
  }

  async deleteItem(id: string): Promise<void> {
    this.isPending.set(true);
    this.error.set(null);

    try {
      const itemRef = ref(db, `${this.tableName}/${id}`);
      await remove(itemRef);
      this.isPending.set(false);
    } catch (err: any) {
      this.error.set(err.message);
      this.isPending.set(false);
      throw err;
    }
  }
}
