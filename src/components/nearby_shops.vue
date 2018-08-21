<template>
  <div class="ui container">
    <div class="ui four stackable cards">
      <div class="ui card" v-for="(item,index) in this.shops">
        <h3 class="header">{{item.name}}</h3>
        <div class="content"><img :src="item.picture" alt=""></div>
        <div class="content">
          <button class="left floated ui button" @click="dislike(item,index)"><i class=" red thumbs down icon"></i>
          </button>
          <button class="right floated ui button" @click="like(item,index)"><i class=" green thumbs up icon"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

  export default {
    components: {},
    name: "nearby_shops",
    data() {
      return {
        shops: []

      }
    },
    mounted() {
      this.getLocation()
      if (!this.$store.state.user) {
        this.$router.push("/sign");
        return;
      }

      var query = {
        user_id: this.$store.state.user._id
      }

      this.$store.dispatchAsync("/nearby_shops", query).then((data) => {
        if (data.succeeded) {
          this.shops = data.data;
        }
      });
    },
    methods: {
      getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition);
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      },
      showPosition(position) {
        console.log("Latitude:" + position.coords.latitude +"<br>Longitude: " + position.coords.longitude);
      },
      like(shop, index) {
        var query = {
          "user_id": this.$store.state.user._id,
          "shop_id": shop._id
        }
        this.$store.dispatchAsync("/like_shop", query).then((res) => {
          if (res.succeeded) {
            this.shops.splice(index, 1)
          }
        });
      },
      dislike(shop, index) {
        var query = {
          "user_id": this.$store.state.user._id,
          "shop_id": shop._id
        }
        this.$store.dispatchAsync("/dislike_shop", query).then((res) => {
          if (res.succeeded) {
            this.shops.splice(index, 1)
          }
        });
      },

    },
    watch: {}
  }
</script>


<style scoped>

</style>
