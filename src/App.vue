<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  // import semantic-ui dependencies
  import 'semantic-ui-css/semantic.min.css'
  import 'jquery'

  export default {
    name: 'App',
    mounted(){
      if(!this.$store.state.user){
        this.$router.push("/sign");
      }else{
        this.$router.push("/shops");
      }
    }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
