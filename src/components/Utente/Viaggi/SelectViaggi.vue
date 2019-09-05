<template>
  <div v-if="waiting">
    <v-layout v-if="waiting" align-center justify-center column fill-height>
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </v-layout>
  </div>
  <div v-else>
    <v-expansion-panels popout class="viaggi-container">
      <card-viaggio
        v-for="(viaggio, index) of this.$store.getters.getViaggi"
        :key="index"
        :viaggio="viaggio"
      ></card-viaggio>
    </v-expansion-panels>
    <v-pagination v-model="pagina" :length="$store.getters.getLunghezzaPagination"></v-pagination>
  </div>
</template>

<script>
import CardViaggio from "./CardViaggio";

export default {
  data() {
    return {
      pagina: parseInt(this.$route.query.pagina) || 1,
      lunghezza: null,
      itemsPerPagina: 10,
      waiting: false
    };
  },
  watch: {
    pagina() {
      this.waiting = true;
      this.$store.commit("changePagina", this.pagina);
      this.$router.push("?pagina=" + this.pagina);
      this.$store
        .dispatch("fetchViaggi", {
          itemsPerPagina: this.itemsPerPagina
        })
        .then(() => {
          this.waiting = false;
        });
    }
  },
  components: {
    CardViaggio
  }
};
</script>

<style scoped>
.viaggi-container {
  margin: 3rem;
}
</style>
