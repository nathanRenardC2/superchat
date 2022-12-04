import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

import React, {useState} from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyAIpYRf1GSafBoAcxrUcXYXDzB1BFprtrU",
  authDomain: "chatapp-fe907.firebaseapp.com",
  projectId: "chatapp-fe907",
  storageBucket: "chatapp-fe907.appspot.com",
  messagingSenderId: "672047358539",
  appId: "1:672047358539:web:be177da43e31ed001a23ce"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className='flex flex-col justify-between'>
      <header className='fixed top-0 left-0 right-0 flex bg-teal-300 h-20 items-center justify-between'>
        <h1 className='text-white font-bold text-2xl ml-5'>SuperChat</h1>
        <div className='flex items-center mr-5'>
          {auth.currentUser && <img className="w-6 h-6 rounded-full mr-3 justify-self-center" src={user.photoURL} alt="user_avatar"></img>}
          {user ? <SignOut /> : <SignIn />}
        </div>
      </header>

      <section className='bg-slate-200 min-h-screen'>
        {user && <ChatRoom />}
      </section>
      
    </div>
  );
}


function SignIn() {

  const useSignInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }

  return(
      <div>
          <button onClick={useSignInWithGoogle}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white justify-self-center">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          </button>
      </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button  onClick={() => auth.signOut()}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white justify-self-center">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
    </button>
  )
}

function ChatRoom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
  }

  return(
    <>
      <div className='mt-24'>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form onSubmit={sendMessage} className="fixed bottom-0 left-0 right-0 flex items-center bg-teal-300 h-20">   
          <div className='w-full flex justify-center'>
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                </div>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message" required />
            </div>
            <button type="submit" className="p-2 ml-2 text-sm font-medium text-white bg-teal-500 rounded-lg border border-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg aria-hidden="true" className="w-5 h-5 text-white" focusable="false" data-prefix="fas" data-icon="paper-plane" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M511.6 36.86l-64 415.1c-1.5 9.734-7.375 18.22-15.97 23.05c-4.844 2.719-10.27 4.097-15.68 4.097c-4.188 0-8.319-.8154-12.29-2.472l-122.6-51.1l-50.86 76.29C226.3 508.5 219.8 512 212.8 512C201.3 512 192 502.7 192 491.2v-96.18c0-7.115 2.372-14.03 6.742-19.64L416 96l-293.7 264.3L19.69 317.5C8.438 312.8 .8125 302.2 .0625 289.1s5.469-23.72 16.06-29.77l448-255.1c10.69-6.109 23.88-5.547 34 1.406S513.5 24.72 511.6 36.86z"></path></svg>
            </button>
          </div>
      </form>
    </>
  )
}

function ChatMessage(props){
  const {text, uid, photoURL, createdAt} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  // Format the createdAt timestamp
  const date = createdAt && createdAt.toDate();
  const time = date && date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const day = date && date.toLocaleDateString();


  return (

    <div>
        <p className='text-center text-gray-400 mt-5'>{day + " à " + time}</p>
        <div className={`message ${messageClass} px-10`}>
          <img className='rounded-full h-14 w-14' src={photoURL} alt="image_profil_send" />
          <p className="w-80 ml-3 flex items-center">{text}</p>
        </div>
    </div>
  )
}


export default App;
