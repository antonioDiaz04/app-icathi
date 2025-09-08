import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class IndexedService {
  private db: IDBDatabase | null = null
  constructor() {
    if (this.isIndexedDBAvailable()) {
      this.openDatabase()
    } else {
      console.warn('IndexedDB no está disponible en este contexto.')
    }
  }

  private waitForDB(): Promise<void> {
    if (this.db) return Promise.resolve()
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('Timeout: No se pudo inicializar IndexedDB')
      }, 5000) // 5 segundos

      this.openDatabase()
      const checkDB = setInterval(() => {
        if (this.db) {
          clearInterval(checkDB)
          clearTimeout(timeout)
          resolve()
        }
      }, 50)
    })
  }

  private openDatabase(): void {
    if (typeof indexedDB === 'undefined') {
      console.error('IndexedDB no está disponible en este entorno.');
      return;
    }

    const request = indexedDB.open('authDB', 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;
      if (!db.objectStoreNames.contains('tokens')) {
        db.createObjectStore('tokens');
      }
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBRequest).result;
      console.log('IndexedDB inicializado con éxito.');
    };

    request.onerror = (event) => {
      console.error('Error al abrir IndexedDB', event);
    };
  }

  private assertDatabaseReady(): void {
    if (!this.db) {
      throw new Error('IndexedDB no está inicializado.')
    }
  }

  private isIndexedDBAvailable(): boolean {
    return typeof indexedDB !== 'undefined'
  }

  // Almacena el token en IndexedDB
  storeToken(token: string): Promise<void> {
    if (!this.isIndexedDBAvailable()) {
      return Promise.reject('IndexedDB no está disponible.')
    }
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction(['tokens'], 'readwrite')
        const store = transaction.objectStore('tokens')
        store.put(token, 'authToken')

        transaction.oncomplete = () => {
          // console.log('Token stored successfully.');
          resolve()
        }

        transaction.onerror = (event) => {
          console.error('Error storing token', event)
          reject('Error storing token')
        }
      } else {
        console.error('Database not initialized.')
        reject('Database not initialized')
      }
    })
  }

  // Recupera el token de IndexedDB
  async getToken(): Promise<string | null> {
    try {
      await this.waitForDB() // Espera a que la base de datos esté inicializada

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['tokens'], 'readonly')
        const store = transaction.objectStore('tokens')
        const request = store.get('authToken')

        request.onsuccess = () => {
          resolve(request.result || null)
        }

        request.onerror = () => {
          reject('Error recuperando el token')
        }
      })
    } catch (error) {
      console.error('Error accediendo a IndexedDB:', error)
      return null
    }
  }

  // Limpia el token de IndexedDB (logout)
  clearToken(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction(['tokens'], 'readwrite')
        const store = transaction.objectStore('tokens')
        store.delete('authToken')

        transaction.oncomplete = () => {
          resolve()
        }

        transaction.onerror = (event) => {
          reject('Error eliminando el token')
        }
      } else {
        reject('Base de datos no inicializada')
      }
    })
  }
}
