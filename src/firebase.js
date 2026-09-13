import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getDocFromServer,
} from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const SETTINGS_DOC_ID = "content";

/**
 * Validate Firestore connection
 */
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "site_settings", SETTINGS_DOC_ID));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.warn("Firestore offline warning:", error.message);
    }
  }
}

/**
 * Load site data from Firestore
 */
export async function loadSiteDataFromFirebase() {
  try {
    const docRef = doc(db, "site_settings", SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.contentJson) {
        return JSON.parse(data.contentJson);
      }
    }
  } catch (err) {
    console.warn("Failed to load from Firebase, falling back:", err);
  }
  return null;
}

/**
 * Save site data to Firestore
 */
export async function saveSiteDataToFirebase(siteData) {
  try {
    const docRef = doc(db, "site_settings", SETTINGS_DOC_ID);
    const payload = {
      contentJson: JSON.stringify(siteData),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload);
    return { success: true };
  } catch (err) {
    console.error("Error saving site data to Firebase Firestore:", err);
    return { success: false, error: err };
  }
}

/**
 * Real-time listener for site data updates
 */
export function subscribeSiteData(onUpdate) {
  try {
    const docRef = doc(db, "site_settings", SETTINGS_DOC_ID);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.contentJson) {
            try {
              const parsed = JSON.parse(data.contentJson);
              onUpdate(parsed);
            } catch (e) {
              console.error("Error parsing real-time site data:", e);
            }
          }
        }
      },
      (error) => {
        console.warn("Firestore subscription notice:", error.message);
      }
    );
  } catch (err) {
    console.warn("Could not attach Firestore listener:", err);
    return () => {};
  }
}
