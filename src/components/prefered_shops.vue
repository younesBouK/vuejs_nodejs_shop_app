<template>
  <div class="ui container">
    <div class="ui four stackable cards">
      <div class="ui card"v-for="(item,index) in this.shops" >
        <h3 class="header">{{item.name}}</h3>
        <div class="content"><img :src="item.picture" alt=""></div>
        <div class="content">
          <button class="right floated ui button" @click="remove(item,index)"><i class=" red trash icon"></i></button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

  export default {
    components:{
    },
    name: "prefered_shops",
    data(){
      return{
        shops: []

      }
    },
    mounted(){
      if(!this.$store.state.user){
        this.$router.push("/sign");
        return;
      }

      var query={
        user_id:this.$store.state.user._id
      }
      this.$store.dispatchAsync("/prefered_shops",query).then((data)=>{
        if(data.succeeded){
          this.shops=data.data;
        }
      });
    },
    methods: {
      remove(shop,index){
        var query={
          shop_id:shop._id,
          user_id:this.$store.state.user._id
        }

        this.$store.dispatchAsync("/remove_prefered_shop",query).then((data)=>{
          if(data.succeeded){
            console.log(data)
            this.shops.splice(index,1);
          }
        });
      },

    },
    watch: {
    }
  }
</script>


<style scoped>

</style>
