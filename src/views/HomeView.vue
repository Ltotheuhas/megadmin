<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="mb-2">Uploaded Files</h1>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-row>
          <v-col v-for="(obj, index) in objects" :key="index" cols="12" md="6" lg="4" xl="3" xxl="2">
            <v-card>
              <v-row class="pa-2">
                <v-col cols="4" class="d-flex align-center justify-center px-6">
                  <v-img v-if="obj.type === 'image'" :src="`${apiUrl}${obj.filePath}`" max-height="100" contain></v-img>
                </v-col>
                <v-col cols="8" class="pl-0">
                  <v-card-title class="pl-0">
                    {{ extractFileName(obj.filePath) }}
                    <br />
                    <small>Uploaded {{ formatDate(extractTimestamp(obj.filePath)) }}</small>
                  </v-card-title>
                  <v-card-actions class="pl-0">
                    <v-btn color="red" @click="confirmDelete(obj._id)">Delete</v-btn>
                    <v-btn color="blue" @click="navigateToEdit(obj._id)">Edit</v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
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
        this.dialog = false;
        this.deleteId = null;
      } catch (error) {
        this.error = 'Failed to delete object';
      }
    },
    navigateToEdit(id) {
      this.$router.push(`/edit/${id}`);
    },
    extractFileName(filePath) {
      const filenameWithTimestamp = filePath.split('/').pop();
      const indexOfFirstHyphen = filenameWithTimestamp.indexOf('-');
      const filename = filenameWithTimestamp.substring(indexOfFirstHyphen + 1);
      return filename;
    },
    extractTimestamp(filePath) {
      const filenameWithTimestamp = filePath.split('/').pop();
      const [timestampStr] = filenameWithTimestamp.split('-');
      return parseInt(timestampStr, 10);
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
  }
};
</script>

<style scoped>
/* Ensure image has a max-width for better control on mobile */
.v-img {
  max-width: 100%;
  height: auto;
}
</style>
