// =====================================================
// 📁 services/authService.ts - Firebase Authentication
// =====================================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, COLLECTIONS } from '../config/firebase';
import { User, LoginCredentials, RegisterCredentials, UserPreferences } from '../types';

// ====== DEFAULT USER PREFERENCES ======

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'it',
  theme: 'auto',
  notifications: true,
  autoAdvance: true,
  hintsEnabled: true,
  soundEnabled: true
};

// ====== AUTH SERVICE CLASS ======

export class AuthService {
  
  // ====== AUTHENTICATION METHODS ======
  
  /**
   * Sign in with email and password
   */
  static async signIn(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      const user = await this.syncUserDocument(userCredential.user);
      await this.updateLastLogin(user.uid);
      
      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUp(credentials: RegisterCredentials): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      // Update profile if displayName provided
      if (credentials.displayName) {
        await updateProfile(userCredential.user, {
          displayName: credentials.displayName
        });
      }

      // Create user document
      const user = await this.createUserDocument(userCredential.user);
      
      // Send verification email
      await sendEmailVerification(userCredential.user);

      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with Google
   */
  static async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      const userCredential = await signInWithPopup(auth, provider);
      const user = await this.syncUserDocument(userCredential.user);
      await this.updateLastLogin(user.uid);

      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      await sendEmailVerification(currentUser);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // ====== USER MANAGEMENT METHODS ======

  /**
   * Update user profile
   */
  static async updateUserProfile(updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<User> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, updates);

      // Update Firestore document
      const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
      await updateDoc(userRef, {
        displayName: updates.displayName || currentUser.displayName,
        photoURL: updates.photoURL || currentUser.photoURL,
        updatedAt: serverTimestamp()
      });

      // Return updated user
      return await this.getCurrentUser();
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user preferences
   */
  static async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
      await updateDoc(userRef, {
        preferences: { ...DEFAULT_PREFERENCES, ...preferences },
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Change password
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('User not authenticated');
    }

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(password: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('User not authenticated');
    }

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      // Delete user document from Firestore
      // Note: This should ideally be done through a Cloud Function
      // to properly clean up all user data
      
      // Delete Firebase Auth account
      await deleteUser(currentUser);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // ====== USER DOCUMENT MANAGEMENT ======

  /**
   * Create user document in Firestore
   */
  private static async createUserDocument(firebaseUser: FirebaseUser): Promise<User> {
    const userDoc: Omit<User, 'id'> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      emailVerified: firebaseUser.emailVerified,
      createdAt: new Date(),
      lastLogin: new Date(),
      preferences: DEFAULT_PREFERENCES
    };

    const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
    await setDoc(userRef, {
      ...userDoc,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });

    return { id: firebaseUser.uid, ...userDoc };
  }

  /**
   * Sync user document with Firebase Auth
   */
  private static async syncUserDocument(firebaseUser: FirebaseUser): Promise<User> {
    const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create document if it doesn't exist
      return await this.createUserDocument(firebaseUser);
    }

    const userData = userSnap.data();
    
    // Update document if Auth data is newer
    const updates: any = {};
    if (userData.email !== firebaseUser.email) updates.email = firebaseUser.email;
    if (userData.displayName !== firebaseUser.displayName) updates.displayName = firebaseUser.displayName;
    if (userData.photoURL !== firebaseUser.photoURL) updates.photoURL = firebaseUser.photoURL;
    if (userData.emailVerified !== firebaseUser.emailVerified) updates.emailVerified = firebaseUser.emailVerified;

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp();
      await updateDoc(userRef, updates);
    }

    return {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      emailVerified: firebaseUser.emailVerified,
      createdAt: userData.createdAt?.toDate() || new Date(),
      lastLogin: userData.lastLogin?.toDate() || new Date(),
      preferences: { ...DEFAULT_PREFERENCES, ...userData.preferences }
    };
  }

  /**
   * Update last login timestamp
   */
  private static async updateLastLogin(uid: string): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp()
    });
  }

  /**
   * Get current user from Firestore
   */
  static async getCurrentUser(): Promise<User> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    return await this.syncUserDocument(currentUser);
  }

  // ====== AUTH STATE OBSERVER ======

  /**
   * Listen to auth state changes
   */
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await this.syncUserDocument(firebaseUser);
          callback(user);
        } catch (error) {
          console.error('Error syncing user document:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // ====== UTILITY METHODS ======

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Get current Firebase user
   */
  static getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Handle authentication errors
   */
  private static handleAuthError(error: any): Error {
    console.error('Auth Error:', error);

    // Firebase Auth error codes
    switch (error.code) {
      case 'auth/user-not-found':
        return new Error('Account non trovato. Verifica l\'email inserita.');
      
      case 'auth/wrong-password':
        return new Error('Password errata. Riprova.');
      
      case 'auth/email-already-in-use':
        return new Error('Email già in uso. Prova con un\'altra email.');
      
      case 'auth/weak-password':
        return new Error('Password troppo debole. Usa almeno 6 caratteri.');
      
      case 'auth/invalid-email':
        return new Error('Email non valida. Controlla il formato.');
      
      case 'auth/user-disabled':
        return new Error('Account disabilitato. Contatta il supporto.');
      
      case 'auth/too-many-requests':
        return new Error('Troppi tentativi. Riprova più tardi.');
      
      case 'auth/network-request-failed':
        return new Error('Errore di connessione. Controlla la rete.');
      
      case 'auth/popup-closed-by-user':
        return new Error('Accesso annullato dall\'utente.');
      
      case 'auth/cancelled-popup-request':
        return new Error('Richiesta di accesso annullata.');
      
      case 'auth/requires-recent-login':
        return new Error('Operazione sensibile. Effettua nuovamente l\'accesso.');
      
      default:
        return new Error(error.message || 'Errore di autenticazione sconosciuto.');
    }
  }
}

// ====== DEFAULT EXPORT ======

export default AuthService;