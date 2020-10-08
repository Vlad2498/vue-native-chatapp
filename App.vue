<template>
  <app-navigator>

  </app-navigator>
</template>



<script>

var firebase = require("firebase/app");
require("firebase/database");

var firebaseConfig = {
  apiKey: "AIzaSyAKtUHBMVfkeMYsP_Gc13pD9YwdFwFaBe4",
  authDomain: "lab02-9f6e1.firebaseapp.com",
  databaseURL: "https://lab02-9f6e1.firebaseio.com",
  projectId: "lab02-9f6e1",
  storageBucket: "lab02-9f6e1.appspot.com",
  messagingSenderId: "139076224716",
  appId: "1:139076224716:web:220675a2967f68d0096469",
  measurementId: "G-ZJHRMPLHMH"
};


import {
  createAppContainer,
  createStackNavigator,
  createDrawerNavigator,
} from "vue-native-router";

import HomeScreen from "./src/components/home";
import signUpScreen from "./src/components/signUp";
import ChatScreen from "./src/components/chat";


// import firebase from 'firebase'
import {chat, signUp, home } from './src/components'


const StackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Signup: signUpScreen,
    Chat: ChatScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppNavigator = createAppContainer(StackNavigator);


export default {
  
  components: { 
    AppNavigator,
    chat, signUp, home
  },

  
  
  data:function(){
    return {
    } 
  },

   async mounted() {

    firebase.initializeApp(firebaseConfig);
  },  
}
</script>