<template>
  <div>


    <!-- top menu -->
    <div class="ui   menu">
      <div class="left floated item" v-if="user">
        <i class="user icon"></i>
        {{user.email}}
      </div>
      <div class="right menu">
        <a class="item active" id="nearby" @click="select('nearby')" title="Nearby shops" >Nearby shops</a>
        <a class="item" id="prefered" @click="select('prefered')" title="Prefered shops" ><i class="favorite icon"></i> Prefered shops</a>
        <a class="item" @click="logout" title="Log out" ><i class="logout icon"></i> LogOut</a>
      </div>
    </div>

    <div class="container">
      <prefered_shops v-if="selected_option==='prefered'"></prefered_shops>
      <nearby_shops v-if="selected_option==='nearby'"></nearby_shops>
    </div>

  </div>
</template>

<script>

  import nearby_shops from '@/components/nearby_shops'
  import prefered_shops from '@/components/prefered_shops'
    export default {
      components:{
        nearby_shops,
        prefered_shops
      },
      name: "shops",
      props: [],
      data() {
        return {
          message:"hello in shops app",
          selected_option:"nearby",

        }
      },
      computed:{
        user(){
          return this.$store.state.user;
        }
      },
      mounted(){
        if(!this.$store.state.user){
          this.$router.push("/sign");
        }else{
          this.$router.push("/shops");
        }
      },
      methods: {
        select(id){
          $('.item').removeClass('active');
          $('#'+id).addClass('active');
          this.selected_option=id;
        },
        logout(){
          this.$store.state.user=undefined;
          this.$router.push("/sign");
        }
      },
      watch: {
      }
    }
</script>

<style scoped>
.active{
  background-color: cornflowerblue !important;
}
</style>
