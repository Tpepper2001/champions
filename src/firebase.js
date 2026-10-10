import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
   getDocFromServer,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const SITE_SETTINGS_COLLECTION = "site_settings";
const SITE_SETTINGS_DOC_ID = "main";
const LOCAL_STORAGE_KEY = "clg_site_content_v1";

export const OperationType = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LIST: "list",
  GET: "get",
  WRITE: "write",
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// Save site content to Firestore
export async function saveSiteDataToFirebase(siteData) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(siteData));
  } catch (e) {
    // ignore storage quota errors
  }

  const path = `${SITE_SETTINGS_COLLECTION}/${SITE_SETTINGS_DOC_ID}`;
  try {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
    await setDoc(docRef, {
      ...siteData,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (structuredErr) {
      return { success: false, error: structuredErr };
    }
    return { success: false, error };
  }
}

// Load site content from Firestore
export async function loadSiteDataFromFirebase() {
  const path = `${SITE_SETTINGS_COLLECTION}/${SITE_SETTINGS_DOC_ID}`;
  try {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data === "object") {
        const { updatedAt, ...rest } = data;
        return rest;
      }
    }
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (e) {
      // Fallback to localStorage below
    }
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    return local ? JSON.parse(local) : null;
  } catch (e) {
    return null;
  }
}

// Real-time listener for site content changes in Firestore
export function subscribeSiteData(callback) {
  const path = `${SITE_SETTINGS_COLLECTION}/${SITE_SETTINGS_DOC_ID}`;
  try {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && typeof data === "object") {
            const { updatedAt, ...rest } = data;
            callback(rest);
          }
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch (e) {
          // logged by handleFirestoreError
        }
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("Could not attach Firebase realtime listener:", err);
    return () => {};
  }
}

export const saveSiteData = saveSiteDataToFirebase;
export const loadSiteData = loadSiteDataFromFirebase;
