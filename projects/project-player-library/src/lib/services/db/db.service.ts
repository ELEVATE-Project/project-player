import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbName = 'projectPlayer'
  private dbVersion = 2
  private storeName = 'projects'
  private db!: IDBDatabase;
  private downloadsDb!: IDBDatabase;
  private storeDownload = 'projects'
  private downloadsDbName= 'downloads'
  private downloadsDbVersion = 3
constructor() {
  this.initializeDatabase(this.dbName, this.dbVersion, [
    { name: 'projects', keyPath: 'key' }
  ])
    .then(db => this.db = db)
    .catch(err => console.error('Main DB init error:', err));

  this.initializeDatabase(this.downloadsDbName, this.downloadsDbVersion, [
    { name: 'projects', keyPath: 'key' },
    { name: 'observation', keyPath: 'key' },
    { name: 'survey', keyPath: 'key' }
  ])
    .then(db => this.downloadsDb = db)
    .catch(err => console.error('Downloads DB init error:', err));
}
private initializeDatabase(
  dbName: string,
  dbVersion: number,
  stores: { name: string; keyPath: string }[]
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      stores.forEach(storeConfig => {
        if (!db.objectStoreNames.contains(storeConfig.name)) {
          db.createObjectStore(storeConfig.name, { keyPath: storeConfig.keyPath });
        }
      });
    };

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
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
    let downloadData:any = null;
    if(data.data.isDownload){
      downloadData = {
        key: data.key,
        data: {
          title : data.data.title,
          subTitle : data.data.description,
          metaData:{
          lastDownloadedAt : data.data.lastDownloadedAt,
          isDownload : data.data.isDownload
          }
        }
      }
    }
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const request = store.put(data);
    request.onsuccess = (event) => {};
    request.onerror = (event) => {
      console.error('Error updating Data: ');
    };
    if(!downloadData) return
    const transactionForDownloads = this.downloadsDb.transaction([this.storeDownload], 'readwrite');
    const storeForDownloads = transactionForDownloads.objectStore(this.storeDownload);
    const requestForDownloads = storeForDownloads.put(downloadData);

    requestForDownloads.onsuccess = (event) => {};
    requestForDownloads.onerror = (event) => {
      console.error('Error updating Data: ');
    };
  }

  deleteData(key: any) {
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    const request = store.delete(key);

    request.onsuccess = (event) => {};

    request.onerror = (event) => {
      console.error('Error deleting item: ',);
    };
  }

  clearDb(){
    const transaction = this.db.transaction([this.storeName], "readwrite");
    const store = transaction.objectStore(this.storeName);
    const request = store.clear();
    request.onsuccess = () => {};
    request.onerror = (event) => {
      console.error("Failed to clear db");
    }
  }

}