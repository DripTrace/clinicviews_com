// src/indexeddb/convoDB.ts

import { openDB, IDBPDatabase } from "idb";

interface Conversation {
  id?: number;
  transcript: string;
  audioUrl: string | null;
  date: Date;
}

let dbPromise: Promise<IDBPDatabase>;

export const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB("LLPMGDB", 1, {
      upgrade(db) {
        db.createObjectStore("conversations", {
          keyPath: "id",
          autoIncrement: true,
        });
      },
    });
  }
  return dbPromise;
};

export const saveConversation = async (conversation: Conversation) => {
  const db = await initDB();
  await db.put("conversations", conversation);
};

export const getConversations = async (): Promise<Conversation[]> => {
  const db = await initDB();
  return await db.getAll("conversations");
};


// import { openDB, DBSchema } from 'idb';

// interface ConversationDB extends DBSchema {
//     conversations: {
//         key: string;
//         value: {
//             transcript: string;
//             audioUrl: string;
//             date: Date;
//             systemResponses: string[];
//         };
//     };
// }

// const dbPromise = openDB<ConversationDB>('conversations-db', 1, {
//     upgrade(db) {
//         db.createObjectStore('conversations');
//     },
// });

// export async function saveConversation(conversation: {
//     transcript: string;
//     audioUrl: string;
//     date: Date;
// }) {
//     const db = await dbPromise;
//     const tx = db.transaction('conversations', 'readwrite');
//     const store = tx.objectStore('conversations');
//     await store.add({
//         ...conversation,
//         systemResponses: [],
//     }, conversation.date.toISOString());
//     await tx.done;
// }

// export async function updateConversationInIndexedDB(conversation: string, systemResponse: string) {
//     const db = await dbPromise;
//     const tx = db.transaction('conversations', 'readwrite');
//     const store = tx.objectStore('conversations');
    
//     const keys = await store.getAllKeys();
//     const latestKey = keys[keys.length - 1];
    
//     if (latestKey) {
//         const latestConversation = await store.get(latestKey);
//         if (latestConversation) {
//             latestConversation.transcript += `\n${conversation}`;
//             latestConversation.systemResponses.push(systemResponse);
//             await store.put(latestConversation, latestKey);
//         }
//     }
    
//     await tx.done;
// }

// export async function getConversations() {
//     const db = await dbPromise;
//     return db.getAll('conversations');
// }

// export async function deleteConversation(key: string) {
//     const db = await dbPromise;
//     await db.delete('conversations', key);
// }

// export async function clearAllConversations() {
//     const db = await dbPromise;
//     const tx = db.transaction('conversations', 'readwrite');
//     await tx.objectStore('conversations').clear();
//     await tx.done;
// }

// export async function getConversationByKey(key: string) {
//     const db = await dbPromise;
//     return db.get('conversations', key);
// }

// export async function updateExistingConversation(key: string, updatedConversation: {
//     transcript: string;
//     audioUrl: string;
//     date: Date;
//     systemResponses: string[];
// }) {
//     const db = await dbPromise;
//     const tx = db.transaction('conversations', 'readwrite');
//     const store = tx.objectStore('conversations');
//     await store.put(updatedConversation, key);
//     await tx.done;
// }