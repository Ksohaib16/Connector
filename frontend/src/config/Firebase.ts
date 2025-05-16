import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyBJrT1dw6qc3ADZIaVs-eHsHtzKLaDRMX0',
    authDomain: 'connector-56f41.firebaseapp.com',
    projectId: 'connector-56f41',
    storageBucket: 'connector-56f41.firebasestorage.app',
    messagingSenderId: '430409194225',
    appId: '1:430409194225:web:7f0e24529261324f466750',
};
console.log(firebaseConfig.apiKey, 'Firebase API Key');
export const app = initializeApp(firebaseConfig);
