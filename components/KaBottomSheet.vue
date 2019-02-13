<template>
  <div class="ka-bottom-sheet"
    :class="{ 'ka-open-sheet': sheet.open }"
  >
    <div class="ka-bottom-liner-padder" v-hammer:pan="onPan" @click="sheet.open = !sheet.open">
      <div class="ka-bottom-liner"></div>
    </div>
    <div class="ka-icon-array" v-hammer:pan="onPan">
      <div class="ka-icon-flex">
        <img class="ka-icon" src="../assets/icons/home.svg" alt="Home">
        <img class="ka-icon" src="../assets/icons/add.svg" alt="Add Message">
        <img class="ka-icon" src="../assets/icons/myself.svg" alt="Profile">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sheet: {
        open: false
      }
    }
  },
  methods: {
    onPan (evt) {
      if (evt.additionalEvent === 'panup') {
        this.sheet.open = true
      } else if (evt.additionalEvent === 'pandown') {
        this.sheet.open = false
      }
    }
  }
}
</script>

<style scoped>
.ka-bottom-sheet{
  position: absolute;
  bottom: 0px;
  left: 20px;
  border-radius: 20px;
  width: calc(100% - 20px * 2);
  background-color: white;
  border: #e0e0e0 solid 1px;
  border-radius: 20px 20px 0px 0px;

  height: calc(100% - 25px - 40px - 25px);
  transform: translateY(calc(100% - 75px));
  transition: transform 1s 0s, box-shadow 0.75s;
  transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  box-shadow: 0px 0px 30px 0px rgb(211, 211, 211);

  border-bottom: none;
}
@media (min-width: 767px) {
  .ka-bottom-sheet {
    width: 600px;
    left: calc(50% - (600px / 2));
  }
}
@media (min-width: 959px) {
  .ka-bottom-sheet {
    width: 900px;
    left: calc(50% - (900px / 2));
  }
}
.ka-bottom-liner{
  width: 100%;
  height: 1px;
  background-color: black;
  border-radius: 2px;
  /* margin-top: 15px; */
}
.ka-bottom-liner-padder{
  margin: 0px auto;
  width: 67%;
  padding-top: 15px;
  padding-bottom: 15px;
  cursor: pointer;
}
.ka-bottom-sheet:hover{
  /* box-shadow: 0px 0px 30px 0px rgb(211, 211, 211); */
}
.ka-bottom-sheet.ka-open-sheet {
  transform: translateY(calc(0px));
}
.ka-icon-flex{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 40px);
  margin: 0px auto;
  margin-bottom: 15px;
}
.ka-icon{
  cursor: pointer;
}
</style>
