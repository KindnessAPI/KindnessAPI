<template>
  <div class="ka-topbar ka-search-box">
    <div class="ka-row-flex">
      <div class="vertically-center icon-div">
        <img class="ka-icon" src="../assets/icons/back.svg" @click="$emit('search', false)" alt="">
      </div>
      <div class="vertically-center search-div">
        <input type="text" ref="focusme" autofocus placeholder="Search...." class="search" v-model="query" @input="update" />
      </div>
      <div class="vertically-center icon-div">
        <img class="ka-icon" src="../assets/icons/search.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: ''
    }
  },
  methods: {
    update () {
      this.$emit('query', this.query)
    }
  },
  mounted () {
    this.$refs.focusme.focus()
  }
}
</script>

<style scoped>
@import url('./ka-topbar.css');
@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.ka-search-box{
  animation: fadein 1s ease 0s 1 normal both;
}
.search{
  width: calc(100% - 20px);
  height: 100%;
  margin: 0px auto;
  appearance: none;
  border: none;
  outline: none;
  font-size: 17px;
  caret-color: #525252;
}
.search:focus{
  outline:none;
}
.search-div{
  width: calc(100%);
  height: 100%;
  margin: 0px auto;
}
</style>
