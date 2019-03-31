<template>
  <section class="container">
    <div>
      <h2>
        Write to Firestore.
      </h2>
      <div>
        <button :disabled="writeSuccessful" @click="writeToFirestore">
          <span v-if="!writeSuccessful">
            Write now
          </span>
          <span v-else>
            Successful!
          </span>
        </button>
      </div>
    </div>
    <div>
      <pre>{{ onData }}</pre>
    </div>
    <div>
      <h2>
        Read from Firestore.
      </h2>
      <div>
        <button :disabled="readSuccessful" @click="readFromFirestore">
          <span v-if="!readSuccessful">
            Read now
          </span>
          <span v-else>
            Successful!
          </span>
        </button>
        <p>{{ text }}</p>
      </div>
    </div>
  </section>
</template>
<script>
/* eslint-disable */
import { fireDb } from '~/plugins/firebase.js'
export default {
  data() {
    return {
      writeSuccessful: false,
      readSuccessful: false,
      text: "",
      onData: false
    }
  },
  mounted () {
    this.listenForChange()
  },
  async asyncData({app, params, error}) {
    const ref = fireDb.collection("test").doc("test")
    let snap
    try {
      snap = await ref.get()
    } catch (e) {
      // TODO: error handling
      console.error(e)
    }
    return {
      text: snap.data().text
    }
  },
  methods: {
    listenForChange () {
      fireDb.collection("test").doc("test")
        .onSnapshot((doc) => {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            var data = doc.data();
            console.log(source, data);
            this.onData = {
              source,
              data
            }
        });
    },
    async writeToFirestore() {
      const ref = fireDb.collection("test").doc("test")
      const document = {
        text: "This is a test message." + Math.random()
      }
      try {
        await ref.set(document)
        this.writeSuccessful = true
      } catch (e) {
        // TODO: error handling
        console.error(e)
        this.writeSuccessful = false
      }

    },
    async readFromFirestore() {
      const ref = fireDb.collection("test").doc("test")
      let snap
      try {
        snap = await ref.get()
        this.text = snap.data().text
        this.readSuccessful = true
      } catch (e) {
        // TODO: error handling
        console.error(e)
        this.readSuccessful = false
      }
    }
  }
}
</script>
<style>
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>