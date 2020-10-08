<template>

  <view class="container" >
    <status-bar
      background-color="blue"
    />
    <header title="Sign in" />

    <!-- E-mail field -->
    <text-input 
    class = "text-input-container"
    placeholder = "E-mail"
    v-model="email"
    />

    <!-- Password field -->
    <text-input 
    class = "text-input-container"
    placeholder = "Password"
    v-model="password"
    secureTextEntry    
    />

    <!-- Error messages -->
    <view v-if="(error!='')" class="error-window">
      <text class="error-text">*{{error}}</text>
    </view> 

    <!-- Signin and Sign Up -->
    <view class="btns"> 
      <button  title="Sign in" @press="() => signin()" color = "purple"></button> <!-- called signing like here because it is an async function -->
    </view>

    <view class="btns"> 
      <button  title="Sign up" @press="goToSignUpScreen" color = "blue" ></button>
    </view>
  
  </view>
</template>

<script>
import { app } from 'firebase'
import header from '../../elements/header'
import {signIn} from "../firebaseModules/user-auth"





export default {

  data:function() {
    return {
      email:'',
      password:'',
      error:''
    }
  },

  // Declare `navigation` as a prop
  props: {
    navigation: {
      type: Object
    },
  },
  methods: {
    
    goToSignUpScreen() {
      this.navigation.navigate("Signup");
    },
    goToChatScreen() {
      this.navigation.navigate("Chat");
    },

// signing async call to the signin function present in user-auth.js file
    signin:async function() {
      var signedIn = await signIn(this.email,this.password);
      if(signedIn.errorMessage) {
      console.log(signedIn.errorMessage)
      console.log("sign in failed")
        this.error = signedIn.errorMessage;
      } else {
        this.error = '';
        // console.log(signedIn);
        console.log("sign in succeded")
        this.goToChatScreen();
      }
    }    

  },
  components: { 
    header
  },
}
</script>

<style >


.container {
  background-color: #121212;
  height: 100%;
  align-items: center;
  flex: 1;
}

.btns{
  margin: 10;
  width: 100px;
}

.text-input-container {
  width: 300;
  height: 40;
  margin: 10;
  padding-left: 5;
  font-size: 22;
  border-color: whitesmoke;
  border-width: 2px;
  border-radius: 5;
  color:white;
}

.error-window {
    flex-direction: row;
    justify-content: center;
    padding:10;
    
}

.error-text {
  font-size:18;
  color:white;
}
</style>