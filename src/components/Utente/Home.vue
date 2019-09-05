<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              @click="$router.push(child.destination)"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ child.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" @click="$router.push(item.destination)">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Gestione Auto Aziendale</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
          <template v-slot:activator="{ on }">
            <v-btn icon large text v-on="on">
              <v-avatar size="30px">
                <img src="/static/avatar/man_4.jpg" alt="Michael Wang" />
              </v-avatar>
            </v-btn>
          </template>
          <v-list class="pa-0">
            <v-list-tile
              v-for="(item, index) of menus"
              :href="item.href"
              @click="item.click"
              rel="noopener"
              :key="index"
            >
              <v-list-tile-action v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <!-- <v-btn icon large>
        <v-avatar size="32px" item>
          <v-img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify"></v-img>
        </v-avatar>
      </v-btn>-->
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    dialog: false,
    drawer: null,
    menus: [
      // {
      //   icon: "account_circle",
      //   href: "#",
      //   title: "fraaaa"
      //   // click: this.handleProfile
      // },
      // {
      //   icon: "settings",
      //   href: "#",
      //   title: "diocane"
      //   // click: this.handleSetting
      // },
      {
        icon: "fullscreen_exit",
        href: "#",
        title: "logout",
        click: this.$router.push('/logout')
      }
    ],
    items: [
      { icon: "account_balance", text: "Home", destination: "/app" },
      {
        icon: "event",
        text: "Prenotazione Auto",
        destination: "/app/selezione-macchine"
      },
      { icon: "explore", text: "Viaggi", destination: "/app/viaggi" },
      {
        icon: "keyboard_arrow_up",
        "icon-alt": "keyboard_arrow_down",
        text: "Utente",
        model: false,
        children: [
          {
            icon: "assignment_ind",
            text: "Visualizza Profilo",
            destination: "/app/user-panel"
          },
          {
            icon: "edit",
            text: "Modifica Password",
            destination: "/app/user-panel"
          },
          {
            icon: "email",
            text: "Modifica Email",
            destination: "/app/user-panel"
          }
        ]
      },
      {
        icon: "file_copy",
        text: "Comunicazioni",
        destination: "/app/comunicazioni"
      },
      {
        icon: "file_copy",
        text: "Segnalazioni",
        destination: "/app/segnalazioni"
      },
      { icon: "settings", text: "Impostazioni" }
    ]
  })
};
</script>