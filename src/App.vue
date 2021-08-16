<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    getUserInfo() {
      this.$api.req(this.$api.userInfo).then(res => {
        const {code, data} = res
        if (code === 200) {
          const {username, display_name, is_staff} = data
          this.$store.dispatch("saveUser", username, display_name)
          this.$store.dispatch("saveUserType", is_staff)
        } else {
          this.$cookie.del("token")
          this.$router.push({name: "login"})
        }
      })
    }
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>

<style>
@import "assets/css/base.css";
@import "assets/css/reset.css";
</style>
