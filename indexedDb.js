// Open an IndexedDB database named 'nostr_data' and access the 'fhir_data' store
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('nostr_data', 1);  // Database name and version

        request.onupgradeneeded = function(event) {
            const db = event.target.result;

            // Create the object store 'fhir_data' if it doesn't exist
            if (!db.objectStoreNames.contains('fhir_data')) {
                const store = db.createObjectStore('fhir_data', { keyPath: 'id' });  // Set 'id' as the keyPath
                store.createIndex('id', 'id', { unique: true });  // Create an index on 'id'
            }
        };

        request.onsuccess = function(event) {
            resolve(event.target.result);  // Return the DB instance on success
        };

        request.onerror = function(event) {
            reject('Error opening IndexedDB: ' + event.target.errorCode);
        };
    });
}

// Store an object in the 'fhir_data' store under a key 'id'
function storeObject(object) {
    return new Promise((resolve, reject) => {
        openDatabase().then(db => {
            if (!(db instanceof IDBDatabase)) {
                reject('Invalid DB object, must be an instance of IDBDatabase');
                return;
            };
            // Ensure the object is serializable
            if (!isSerializable(object)) {
                reject('Object contains non-serializable data');
                return;
            };

            const transaction = db.transaction('fhir_data', 'readwrite');  // Open the transaction in 'readwrite' mode
            const store = transaction.objectStore('fhir_data');  // Access the 'fhir_data' store

            const request = store.put(object);  // Put the object into the store (or update if exists)

            request.onsuccess = function() {
                resolve('Object stored successfully!');
            };

            request.onerror = function(event) {
                reject('Error storing object: ' + event.target.errorCode);
            };
        });
    });
}
function isSerializable(obj) {
    try {
        // Check that all parts of the object are serializable
        JSON.stringify(obj);
        return true;
    } catch (e) {
        console.error('Object not serializable:', e);
        return false;
    }
}

// Retrieve all objects from the 'fhir_data' store
function getAllObjects() {
    return new Promise((resolve, reject) => {
        openDatabase().then(db => {
            const transaction = db.transaction('fhir_data', 'readwrite');  // Open the transaction in 'readonly' mode
            const store = transaction.objectStore('fhir_data');  // Access the 'fhir_data' store

            const request = store.getAll();  // Get all objects from the store

            request.onsuccess = function(event) {
                resolve(event.target.result);  // Return all objects in the store
            };

            request.onerror = function(event) {
                reject('Error retrieving all objects: ' + event.target.errorCode);
            };
        });
    });
}


