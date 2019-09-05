<template>
  <div>
    <v-text-field v-model="comunicazione"></v-text-field>
    <v-text-field v-model="tipologia"></v-text-field>
    <v-btn @click="commitComunicazione"></v-btn>
    <div v-for="(comunicazione, index) of this.$store.getters.getComunicazioni" :key="index">
      <h1>{{comunicazione.comunicazione}}</h1>
      <h1>{{comunicazione.tipologia}}</h1>
    </div>
    <!-- <v-pagination v-model="pagina" :length="$store.getters.getComunicazioni"></v-pagination> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      comunicazione: "",
      tipologia: ""
    };
  },
  methods: {
    commitComunicazione() {
      this.$store.dispatch("commitComunicazione", {
        comunicazione: this.comunicazione,
        tipologia: this.tipologia
      });
    }
  },
  created() {
    this.$store.dispatch("fetchComunicazioni");
  }
};
</script>