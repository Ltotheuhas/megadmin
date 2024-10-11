<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Login</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="login">
                <v-text-field
                  v-model="password"
                  label="Enter Password"
                  type="password"
                  required
                ></v-text-field>
                <v-btn type="submit" color="primary">Login</v-btn>
              </v-form>
            </v-card-text>
            <v-alert v-if="error" type="error" outlined>
              Incorrect password. Please try again.
            </v-alert>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        password: '',
        error: false,
        correctPassword: 'megapasswort' // Change this to your desired password
      };
    },
    methods: {
      login() {
        if (this.password === this.correctPassword) {
          localStorage.setItem('authenticated', true);
          this.$router.push('/');
        } else {
          this.error = true;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add any necessary styling here */
  </style>
  