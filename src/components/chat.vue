<template>
    <view class="container">

      <!-- Top 2 buttons row -->
      <view class="topBtn">

        <button  title="Sign out" @press="logout"></button>

        <view class="topBtnRight">
        <button  title="Delete account" @press="delAccount(authUser)"></button>
        </view>

      </view>
      
      <text  class="text-title-secondary">Signed in as {{authUser.email}}</text>
      <text class="text-title-primary">Your conversation: </text>
      <scroll-view :content-container-style="{contentContainer: {flex:1}}" ref="scrlview">
      

      <!-- Displaying the messages -->
       <view v-for="message in messages" :key="message.key" :class="[message.sender == authUser.email? 'sent_msg' : 'received_msg' ]">

            <!-- <text class="white-normal"> {{message.text}} </text> -->
            <text-input v-if="message.sender == authUser.email && message.key == edKey " class="white-normal-edit" v-model="message.text"> </text-input>
            <text v-else class="white-normal" v-model="message.text">{{message.text}} </text>
            
            <text class="white-small"> sent by: {{message.sender}} </text> 
            
            <!-- Delete the message -->
            <touchable-opacity 
            v-if="message.sender == authUser.email && edKey != message.key"
            :on-press="() =>deleteMessage(message.key)">

              <image :source= "require('../../assets/close_white.png')" class="imageContainer"/> 
            </touchable-opacity>

          <!-- Edit the message -->
            <text v-if="message.sender == authUser.email && edKey != message.key" @press='setEdit(message.key)'>Edit</text>
            <text class="cancel" v-if="message.sender == authUser.email && message.key == edKey" @press='cancelEdit(message.key)'>Cancel</text>

            <text class="save" v-if="message.sender == authUser.email && message.key == edKey" @press='saveEdit(message)'>Save</text>
         
        </view>
      </scroll-view>    

      <!-- Message box and send button -->
      <view class="message-view"> 
        <text-input
          v-model="messageInput"
          class="message-box"
          placeholder = "Type a message"
        ></text-input>
      
        <touchable-opacity v-if="!edKey" :on-press="()=>onSendMessage()" :disabled="(messageInput == '')">
          <view  class="button-view">
                    <text class="white-bold">Send</text>
                  </view>
        </touchable-opacity>
      </view>
      
  </view>
</template>


<script>
var firebase = require("firebase/app");




export default {
  data() {
    return { 
      messageInput: "", 
      messagesRef: "", 
      messages: [],
      authUser:{},
      edKey : "" //boolean value for a message if it is currently being edited
    };
  },

  props: {
    navigation: {
      type: Object
    },
  },

  methods: {

    // Returns the user to the home screen
    goToHomeScreen() {
      this.navigation.navigate("Home");
    },

    // Adds the message to the database
    onSendMessage() {
      this.messagesRef.push({ text: this.messageInput, sender: this.authUser.email }, (err) => {
        if (err) {
          // Alert or show this error to the user if anything goes wrong
          // console.log({ err });
        }
        this.messageInput = ""
        

      });     
    },

// Delete account function takes as input the currently authenticated user
    delAccount(crntUser){
      // Deleting all the messages of the the currently logged in user
      var msg = this.messages
      for (var mesage in msg) {
              if (msg[mesage].sender == this.authUser.email) {
          // console.log ("before deletion")
          this.deleteMessage(msg[mesage].key);
        }
      }
    // Deleting the current logged in user's account
      crntUser.delete().then(function() {
        console.log("The account belonging to this email address: " + crntUser.email + " has beeen deleted");
      }).then(this.logout()).catch(function(error) {
        // An error happened.
        console.log(error)
      });  

    },

// Delete message function. Takes as input the message key
    deleteMessage(key){
      this.messagesRef.child(key).remove();
      console.log("message deleted" + " " + key)
    },

// Sets a message's state to be edited
    setEdit(key){
      this.messagesRef.child(key).update({edit : true})
      this.edKey = key
      console.log(this.edKey)
      // console.log("edit mesage" + " "+ key) 
    },

// Saves the changes made to a message
    saveEdit(message){
      const key = message.key
      console.log(message.text)
      this.messagesRef.child(key).set({text : message.text, edit : false, sender : message.sender})
      this.messagesRef.child(key).update({hasBeenEdited : true}) //boolean value to show a message has been edited. Useful for further developments maybe ?

      this.edKey = ""
    },

// Cancels the changes made to the message
    cancelEdit(key){
      this.messagesRef.child(key).update({edit : false})
      this.edKey = ""
    },

// Logs the user out
    logout(){
      var out = false
        firebase.auth().signOut().then(function() {
            console.log("Sign out successful")
            out = true
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
          });
          if (out = true){ this.goToHomeScreen()}
        }
  },


  // Everything that gets executed here happens at the moment the page has been loaded.
  mounted() {
    this.messagesRef = firebase.database().ref("messages");

    firebase
      .database()
      .ref("messages") // name of the collection
      .on("value", (snap) => { 
        // Empty the all showing messages to avoid duplicates
        this.messages = [];
        const fbVal = snap.val();

      firebase.auth().onAuthStateChanged(user => {
                if(user){
                    this.authUser = user
                    // console.log( "Chat user is : " + this.authUser.email)
                } else {
                    this.authUser = {}
                }
            })

        // Loads messages 
        for (const key in fbVal) {
          const dbMessage = fbVal[key];

          if (dbMessage.text && dbMessage.sender) {
            const text = dbMessage.text;
            const sender = dbMessage.sender;
            // console.log(dbMessage.text);
            this.messages.push({ key, text, sender });
            // var animate = this.$refs.scrlview
            // animate.scrollToEnd({animated: true})
          }
        }
      });
  },
}
</script>

<style>

.sent_msg {
  background-color:#0A84FF;
  padding:12;
  border-radius: 10;
  flex: 1;
 
  margin-bottom: 10px;
  margin-left: 100px;
  text-align: right;
}

.received_msg {
  background-color:#30D158;
  padding:12;
  border-radius: 10;
  flex: 1;
  margin-right: 100px;
  font-size: 16;
  color:white;
  margin-bottom: 10px;
}

.message-box {
  background-color: #74748018;
  padding:12;
  border-radius: 10;
  width:300;
  font-size: 16;
  color:white
}

.button-view {
    padding:12;
    background-color:#0A84FF;
    align-items: center;
    text-align:center;
    border-radius:15;
}
.white-bold {
  font-size:18;
  font-weight:bold;
  color:white
}
.white-normal {
  font-size:18;
  color:white;
  position: relative;
}

.white-normal-edit {
  font-size:18;
  color:white;
  position: relative;
  border-color: white;
  border-width: 1px;
}

.white-small {
  font-size:10;
  color:white;
  font-style: italic;
}

.message-view {
  flex-direction:row;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 10px;
}

.container {
  background-color: #121212;
  height: 100%;
  align-items: center;
  flex: 1;
}
.text-title-primary {
  color: blue;
  margin-top: 10;
  margin-bottom: 5;
  font-size: 25;
}
.text-title-secondary {
  color: blue;
  font-size: 20;
}

.imageContainer{
  width: 20px;
  height: 20px;
  position: relative;
  left:85%;
  bottom: 55%;
}

.save{
  position: relative;
  left: 90%;
  bottom: 0%;
  font-size: 14;
}
.cancel{
  position: relative;
  top: 20%;
  font-size: 14;
}

.topBtn{
  display: flex;
  flex-direction: row;
  width: 100%;
}

.topBtnRight{
  margin-left: 46%;
}
</style>
