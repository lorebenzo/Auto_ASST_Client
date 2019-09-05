<template>
  <div class="comunicazioni-container">
    <v-alert v-for="(comunicazione, index) of this.$store.getters.getComunicazioni"
        :key="index" :type="comunicazione.tipologia">{{ comunicazione.comunicazione}}</v-alert>
  </div>

</template>

<script>
export default {
  created() {
    this.$store.dispatch("fetchComunicazioni");
  }
};
</script>
<style scoped>
  .comunicazioni-container{
    margin: 3rem;
  }
</style>