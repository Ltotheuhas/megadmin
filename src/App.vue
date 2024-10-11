<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <router-link to="/" style="color: white; text-decoration: none;">
          Admin Interface
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="isAuthenticated && !isLoginPage" color="secondary" @click="logout">
        Logout
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} Megawörld</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      return localStorage.getItem('authenticated') === 'true';
    },
    isLoginPage() {
      return this.$route.path === "/login";
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('authenticated');
      this.$router.push('/login');
    }
  }
};
</script>