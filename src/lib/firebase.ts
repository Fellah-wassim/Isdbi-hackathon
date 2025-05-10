// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD17YPokOpFj37pgg-7xSoAipQ51_rEitg',

  authDomain: 'finance-b24ed.firebaseapp.com',

  projectId: 'finance-b24ed',

  storageBucket: 'finance-b24ed.firebasestorage.app',

  messagingSenderId: '607589985921',

  appId: '1:607589985921:web:a48e6fd332b38f0e162780',

  measurementId: 'G-9J3MBPZN74',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
