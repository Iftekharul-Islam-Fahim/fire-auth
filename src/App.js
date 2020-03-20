import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    //console.log("i am clicked!");
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);

        console.log(displayName, photoURL, email);
      })
      .catch(error => {
        console.log(error);
        console.log(error.message);
      })
  };

  const handleSignOut = () => {
    //console.log("i am clicked");
    firebase.auth().signOut()
      .then(result => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          password: '',
          error: '',
          isValid: false,
          existingUser: false
        }
        setUser(signedOutUser);
      })
      .catch(error => {
        console.log(error);
        console.log(error.message);
      })
  };

  const isValidEmail = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  //  /^.+@.+\..+$/.test(email);
  const hasNumber = input => /\d/.test(input);
  const switchForm = event => {

    const createdUser = {...user};
    createdUser.existingUser = event.target.checked;
    setUser(createdUser);
    
    //console.log(event.target.checked);
  };

  const handleChange = event => {
    //console.log(event.target.value);
    const newUserInfo = {
      ...user
    };

    //perform validation
    let isValid = true;
    if(event.target.name === 'email'){
      isValid = isValidEmail(event.target.value);
    }
    if(event.target.name === 'password'){
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }

    newUserInfo[event.target.name] = event.target.value
    newUserInfo.isValid = isValid;
    //console.log(newUserInfo);
    setUser(newUserInfo);
  };

  const handleCreateAccount = (event) => {
    if(user.isValid){
      //console.log(user.email, user.password);
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(response => {
        console.log(response);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(error => {
        console.log(error.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = error.message;
        setUser(createdUser);
      })
    }
    else{
      console.log("form is not valid!");
    }
    event.preventDefault();
    event.target.reset();
  };

  const handleSignInUser = event => {
    if(user.isValid){
      //console.log(user.email, user.password);
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(response => {
        console.log(response);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(error => {
        console.log(error.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = error.message;
        setUser(createdUser);
      })
    }
    else{
      console.log("form is not valid!");
    }
    event.preventDefault();
    event.target.reset();
  };

  return (
    <div className="App">
      {
        user.isSignedIn
          ? <button onClick={handleSignOut}>Sign Out</button>
          : <button onClick={handleSignIn}>Sign In</button>
      }

      {
        user.isSignedIn &&
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Custom Authentication</h1>
      {
        user.error && <p style={{color: 'red'}}>{user.error}</p>
      }

      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm">Already An User?</label>

      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={handleSignInUser}>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter Email" required/>
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter Password" required/>
        <br />
        <input type="submit" value="Sign In" />
      </form>

      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={handleCreateAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Enter Name" required/>
        <br />
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter Email" required/>
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter Password" required/>
        <br />
        <input type="submit" value="Create Account" />
      </form>
    </div>
  );
}

export default App;
