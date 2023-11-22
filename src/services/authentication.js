import { auth } from '../firebase'

const AuthenticationService = {
  async isLoggedIn () {
    const user = await auth().currentUser
    return !!user
  },

  observeStatus (callback) {
    auth().onAuthStateChanged(callback)
  },
 
  async loginWithGoogle() {
    const provider = new auth.GoogleAuthProvider();

    return auth()
      .signInWithPopup(provider)
      .then(res => {
        const token = res.credential.accessToken
        const user = res.user

        return {
          token, user
        }
      })
  },

  async loginWithEmailAndPassword(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      // Handle errors, por exemplo: exibir uma mensagem de erro para o usuário
      console.error('Erro no login com e-mail e senha:', error.message);
      throw error;
    }
  },

  async registerWithEmailAndPassword(email, password) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      // Handle errors, por exemplo: exibir uma mensagem de erro para o usuário
      console.error('Erro no registro com e-mail e senha:', error.message);
      throw error;
    }
  }

}

export default AuthenticationService