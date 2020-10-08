import firebase from 'firebase'

async function register(email, password, name) {
    try {
        const registered = await firebase.auth().createUserWithEmailAndPassword(email, password);
        if (registered) {
           return registered.user;
        }
        else {
            return null;
        }
    } catch (e) {
        // console.log(e.message);
        return {
            errorMessage:e.message
        }
    }
}

async function signIn(email,password) {
    // console.log(email,password);
    try {
        const signedIn = await firebase.auth().signInWithEmailAndPassword(email, password);
        // console.log(signedIn);
        if (signedIn) {
            return signedIn.user;
        }
    } catch (e) {
        // console.log(e.message);
        return {
            errorMessage:e.message
        }
    }
}

export {register, signIn}