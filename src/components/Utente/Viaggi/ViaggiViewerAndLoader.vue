<template>
  <div>
    <v-container>
      <v-layout v-if="waiting" align-center justify-center column fill-height>
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </v-layout>
      <transition>
      <router-view></router-view>
      </transition>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      waiting: true
    };
  },
  created() {
    // Se nell'URL è specificata la pagina, faccio update della pagina
    if (this.$route.query.pagina)
      this.$store.commit("changePagina", this.$route.query.pagina);
    // Altrimenti inizializzo la prima
    else this.$store.commit("changePagina", 1);
    this.$store
      .dispatch("fetchViaggi", {
        itemsPerPagina: 10
      })
      .then(() => (this.waiting = false))
      .catch(err => (this.waiting = false));
  }
};
</script>