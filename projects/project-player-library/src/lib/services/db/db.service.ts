import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbName = 'projectPlayer'
  private dbVersion = 1
  private storeName = 'projects'
  private db!: IDBDatabase

  constructor() {
    this.initializeDb()
  }

  private initializeDb(){
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(this.storeName, { keyPath: 'key' });
    };

    request.onsuccess = (event: Event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = (event: Event) => {
      console.error('Error opening database:', (event.target as IDBOpenDBRequest).error);
    };
  }

  addData(data:any){
    const transaction = this.db.transaction([this.storeName],'readwrite')
    const store = transaction.objectStore(this.storeName)
    store.add(data)
  }

  getData(key:any):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName],'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(key)
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(request.result)
      }
    })
  }

  updateData(data: any) {
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const request = store.put(data);
    
    request.onsuccess = (event) => {
      console.log('Data updated successfully');
    };

    request.onerror = (event) => {
      console.error('Error updating Data: ');
    };
  }

  deleteData(key: any) {
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const request = store.delete(key);

    request.onsuccess = (event) => {
      console.log('Item deleted successfully');
    };

    request.onerror = (event) => {
      console.error('Error deleting item: ',);
    };
  }

}