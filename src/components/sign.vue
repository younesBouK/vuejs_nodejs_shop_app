<template>
  <div class="ui container">

    <div class="ui middle aligned center aligned grid">
      <div class="column">
        <h2 class="ui teal image header">
          <div class="content">
            Log-in to your account
          </div>
        </h2>
        <form class="ui tiny form">
          <div class="ui stacked segment">
            <div class="field" id="email">
              <div class="ui left icon input">
                <i class="user icon"></i>
                <input type="text" v-model="user.email" name="email" placeholder="E-mail address">
              </div>
            </div>
            <div class="field" id="password">
              <div class="ui left icon input">
                <i class="lock icon"></i>
                <input type="password" v-model="user.password" name="password" placeholder="Password">
              </div>
            </div>
            <div v-if="action==='signin'" @click="signin" class="ui fluid large teal submit button">Sign In</div>
            <div v-if="action==='signup'" @click="signup" class="ui fluid large teal submit button">Sign Up</div>
          </div>

          <div class="ui error message"></div>

        </form>

        <div class="ui message error" v-if="error">
          {{error}}
        </div>

        <div class="ui message" v-if="action==='signin'">
          New to us? <a href="#" @click="action='signup'; user={}">Sign Up</a>
        </div>
        <div class="ui message" v-if="action==='signup'">
          You have an account ? <a href="#" @click="action='signin' ; user={}">Sign In</a>
        </div>
      </div>
    </div>


  </div>
</template>

<script>

  export default {
    name: "sign",
    data() {
      return {
        action: "signin",
        user: {
          email: "",
          password: ""
        },
        error:undefined
      }
    },
    methods: {
      validateEmail(email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test(email);
      },
      validateForm(){
        if (!this.validateEmail(this.user.email)){
          $("#email").addClass("error")
          this.error="Email not valide !"
          return false
        }

        if (this.user.password.length<6){
          $("#password").addClass("error")
          this.error="Password too short!"
          return false
        }
        return true;
      },

      signin() {
         if(!this.validateForm())
           return
        $('.field').removeClass("error");
        this.$store.dispatchAsync("/signin", this.user).then((resp) => {
          console.log(resp);
          if(resp.succeeded){
            this.user=resp.data;
            this.$store.state.user=this.user;
            this.$router.push("/shops");
          }else{
            this.error=resp.error;
            $("#password").addClass("error")
            $("#email").addClass("error")
          }

        });
      },

      signup() {
        if(!this.validateForm())
          return

        $('.field').removeClass("error");
        this.$store.dispatchAsync("/signup", this.user).then((resp) => {
          console.log(resp);
          if(resp.succeeded){
            this.user=resp.data;
            this.$store.state.user=this.user;
            this.$router.push("/shops");
          }else{
            this.error=resp.error;
          }
        });
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>
  .column {
    max-width: 450px;
  }
</style>
