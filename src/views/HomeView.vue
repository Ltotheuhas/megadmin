<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Uploaded Files</h1>
          <v-alert v-if="error" type="error">{{ error }}</v-alert>
          <v-row>
            <v-col v-for="(obj, index) in objects" :key="index" cols="12" md="6" lg="4">
              <v-card>
                <v-img v-if="obj.type === 'image'" :src="`${apiUrl}${obj.filePath}`" contain></v-img>
                <v-card-title>
                  {{ obj.filePath.split('-').pop() }}
                </v-card-title>
                <v-card-actions>
                  <v-btn color="red" @click="confirmDelete(obj._id)">Delete</v-btn>
                  <v-btn color="blue" @click="navigateToEdit(obj._id)">Edit</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      
      <!-- Confirmation Dialog -->
      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Confirm Deletion</v-card-title>
          <v-card-text>Are you sure you want to delete this object?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">No</v-btn>
            <v-btn color="red darken-1" text @click="performDelete">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import { fetchObjects, deleteObject } from '@/apiService.js';
  
  export default {
    data() {
      return {
        objects: [],
        error: null,
        dialog: false,
        deleteId: null,
        apiUrl: import.meta.env.VITE_APP_API_URL,
      };
    },
    created() {
      this.loadObjects();
    },
    methods: {
      async loadObjects() {
        try {
          this.objects = await fetchObjects();
        } catch (error) {
          this.error = 'Failed to load objects';
        }
      },
      confirmDelete(id) {
        this.deleteId = id;
        this.dialog = true;
      },
      async performDelete() {
        try {
          await deleteObject(this.deleteId);
          this.objects = this.objects.filter((obj) => obj._id !== this.deleteId);
          this.dialog = false; // Close the dialog
          this.deleteId = null; // Reset deleteId
        } catch (error) {
          this.error = 'Failed to delete object';
        }
      },
      navigateToEdit(id) {
        this.$router.push(`/edit/${id}`);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add any additional styling here */
  </style>
  