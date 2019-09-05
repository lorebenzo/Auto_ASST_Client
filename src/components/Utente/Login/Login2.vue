<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field label="Username" name="username" type="text" v-model="username"></v-text-field>
                <v-text-field label="Password" name="password" type="password" v-model="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="loginProcess" color="primary">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <h2>{{ this.$store.getters.getAuthStatus}}</h2>
    </v-container>
  </v-content>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapActions["login"],
    loginProcess() {
      if (this.username && this.password) {
        var dati = {
          username: this.username,
          password: this.password
        };
        this.$store
          .dispatch("login", dati)
          .then(() => {
            this.$router.push("/app/car-select");
          });
          // .catch(() => {});
      }
    }
  },
  computed: {
    ...mapGetters["getAuthStatus"]
  }
};
</script>

<style scoped>
</style>