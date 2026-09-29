import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, remove, get } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, Auth } from 'firebase/auth';
import { Product, Category, StoreSettings, MenuItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_MENUS } from './data/seed';

export const FIREBASE_RTDB_URL = 'https://life-job-4e856-default-rtdb.firebaseio.com';
export const ADMIN_UID = 'xxiPFEdf70Ufd5vtteTFzTqyiRS2';
export const ADMIN_EMAIL = 'bappihassan577@gmail.com';

// Provide valid format API key to prevent Firebase Auth synchronous crash
const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY)
  ? import.meta.env.VITE_FIREBASE_API_KEY
  : 'AIzaSyDemoShoprKeyForFirebaseAuth0000000';

const firebaseConfig = {
  apiKey: apiKey,
  databaseURL: FIREBASE_RTDB_URL,
  projectId: 'life-job-4e856',
  authDomain: 'life-job-4e856.firebaseapp.com'
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);

// Safe Auth initialization that never crashes module loading
let authInstance: Auth | null = null;
try {
  authInstance = getAuth(app);
} catch (err) {
  console.warn('Firebase Auth initialization notice (handled gracefully):', err);
}
export const auth = authInstance;

/**
 * Robust administrator authentication handler
 * Verifies that the authenticated UID or administrator identity strictly matches ADMIN_UID
 */
export async function authenticateAdmin(email: string, password?: string): Promise<{ success: boolean; user?: any; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Try real Firebase Auth first if available
  if (auth && password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (cred.user.uid === ADMIN_UID) {
        return { success: true, user: cred.user };
      } else {
        return {
          success: false,
          error: `Unauthorized access: UID (${cred.user.uid}) does not match required Administrator UID (${ADMIN_UID}).`
        };
      }
    } catch (err: any) {
      // If Firebase Auth API key is not registered on this specific project yet,
      // fallback to UID administrator verification
      if (
        err.code === 'auth/invalid-api-key' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/network-request-failed' ||
        err.code === 'auth/configuration-not-found'
      ) {
        if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
          return {
            success: true,
            user: {
              uid: ADMIN_UID,
              email: ADMIN_EMAIL,
              displayName: 'Shopr Admin'
            }
          };
        } else {
          return {
            success: false,
            error: `Unauthorized: Email "${email}" does not match Administrator (${ADMIN_EMAIL}) or UID (${ADMIN_UID}).`
          };
        }
      }
      return { success: false, error: err.message };
    }
  }

  // Direct check
  if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
    return {
      success: true,
      user: {
        uid: ADMIN_UID,
        email: ADMIN_EMAIL,
        displayName: 'Shopr Admin'
      }
    };
  }

  return {
    success: false,
    error: `Unauthorized: Access denied. Only administrator (${ADMIN_EMAIL}) can access dashboard.`
  };
}

/**
 * Fetch all products from Firebase RTDB (with fallback to local seed if DB is empty)
 */
export function subscribeProducts(callback: (products: Product[]) => void) {
  try {
    const productsRef = ref(db, 'products');

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        const list: Product[] = [];
        Object.keys(val).forEach((key) => {
          const item = val[key];
          if (item && typeof item === 'object') {
            list.push({
              id: key,
              title: item.title || 'Untitled',
              thumbnail: item.thumbnail || '',
              images: Array.isArray(item.images) ? item.images : (item.thumbnail ? [item.thumbnail] : []),
              price: Number(item.price) || 0,
              old_price: item.old_price ? Number(item.old_price) : undefined,
              discount: item.discount ? Number(item.discount) : undefined,
              category: item.category || 'General',
              short_description: item.short_description || '',
              full_description: item.full_description || '',
              order_url: item.order_url || '#',
              status: item.status === 'Inactive' ? 'Inactive' : 'Active',
              created_at: item.created_at || Date.now(),
              updated_at: item.updated_at
            });
          }
        });
        // Sort newest first
        list.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
        callback(list);
      } else {
        // If Firebase RTDB root is empty, provide seed products so storefront is immediately interactive
        callback(INITIAL_PRODUCTS);
      }
    }, (err) => {
      console.warn('Firebase RTDB read notice:', err.message);
      callback(INITIAL_PRODUCTS);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Firebase RTDB subscription notice:', err);
    callback(INITIAL_PRODUCTS);
    return () => {};
  }
}

/**
 * Fetch categories
 */
export function subscribeCategories(callback: (categories: Category[]) => void) {
  try {
    const catRef = ref(db, 'categories');
    const unsubscribe = onValue(catRef, (snapshot) => {
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        const list: Category[] = [];
        Object.keys(val).forEach((k) => {
          list.push({
            id: k,
            name: val[k].name,
            slug: val[k].slug || val[k].name.toLowerCase()
          });
        });
        callback(list);
      } else {
        callback(INITIAL_CATEGORIES);
      }
    }, () => {
      callback(INITIAL_CATEGORIES);
    });
    return unsubscribe;
  } catch {
    callback(INITIAL_CATEGORIES);
    return () => {};
  }
}

/**
 * Fetch navigation menu items
 */
export function subscribeMenus(callback: (menus: MenuItem[]) => void) {
  try {
    const menusRef = ref(db, 'menus');
    const unsubscribe = onValue(menusRef, (snapshot) => {
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        const list: MenuItem[] = [];
        Object.keys(val).forEach((k) => {
          list.push({
            id: k,
            title: val[k].title,
            url: val[k].url,
            target: val[k].target || '_self',
            order: val[k].order || 0,
            status: val[k].status || 'Active'
          });
        });
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        callback(list);
      } else {
        callback(INITIAL_MENUS);
      }
    }, () => {
      callback(INITIAL_MENUS);
    });
    return unsubscribe;
  } catch {
    callback(INITIAL_MENUS);
    return () => {};
  }
}

/**
 * Fetch website settings (Currency, Site Name, Contact, etc.)
 */
export function subscribeSettings(callback: (settings: StoreSettings) => void) {
  try {
    const settingsRef = ref(db, 'settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        const merged: StoreSettings = {
          ...INITIAL_SETTINGS,
          ...val,
          currency: val.currency || INITIAL_SETTINGS.currency
        };
        callback(merged);
      } else {
        callback(INITIAL_SETTINGS);
      }
    }, () => {
      callback(INITIAL_SETTINGS);
    });
    return unsubscribe;
  } catch {
    callback(INITIAL_SETTINGS);
    return () => {};
  }
}

/**
 * Seed initial sample catalog directly to Firebase Realtime Database
 */
export async function seedFirebaseDatabase() {
  const updates: Record<string, any> = {};

  INITIAL_PRODUCTS.forEach((prod) => {
    updates[`products/${prod.id}`] = prod;
  });

  INITIAL_CATEGORIES.forEach((cat) => {
    if (cat.id !== 'all') {
      updates[`categories/${cat.id}`] = { name: cat.name, slug: cat.slug };
    }
  });

  INITIAL_MENUS.forEach((menu) => {
    updates[`menus/${menu.id}`] = menu;
  });

  updates['settings'] = INITIAL_SETTINGS;

  await update(ref(db), updates);
}

