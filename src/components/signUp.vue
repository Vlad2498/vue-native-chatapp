<template>
  <view class="container">
    <header title="Sign up" />    

  <view>
      
    <!-- E-mail field -->
    <text-input 
    class = "text-input-container"
    placeholder = "E-mail"
    v-model="email"
    />
    
    <!-- Password field-->
    <text-input 
    class = "text-input-container"
    placeholder = "Password"
    v-model="password"
    secureTextEntry
    />
  </view>

  <!-- Error messages -->
  <view v-if="(error!='')" class="error-window">
    <text class="error-text">*{{error}}</text>
  </view> 

  <!-- Sign up and sign in -->
  <view class="btns"> 
    <button title="Sign up" @press="() => register()"></button>
  </view>

  <view class="btns"> 
    <button title="Sign in" @press="goToHomeScreen" color = "purple"></button>
  </view>

  </view>
</template>

<script>
import header from '../../elements/header'
import { register } from "../firebaseModules/user-auth"

export default {
  // Declare `navigation` as a prop
  props: {
    navigation: {
      type: Object
    },
    userSignedIn:{
      type : Function
    },
    login:{
      type : Function
    }
  },

  data: function() {
      return {
        email : "",
        password : "",
        error : ""
      };
    },

  methods: {
    goToHomeScreen() {
      this.navigation.navigate("Home");
    },
    goToChatScreen() {
      this.navigation.navigate("Chat");
    },
    register:async function() {
      var registerSuccess = await register(this.email, this.password);

      if (registerSuccess.errorMessage ) {
        if (registerSuccess.errorMessage.substring(0,8) == "Function") {
            this.error = "";
        } else {
          console.log(registerSuccess.errorMessage)
          this.error = registerSuccess.errorMessage; 
      }   
      } else {
          this.goToChatScreen();
      }

    },
       
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

.btns{
  margin: 10;
  width: 100px;
}

.error-text {
  font-size:18;
  color:white;
}
</style>