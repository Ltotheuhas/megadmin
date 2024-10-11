<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>Edit Object</h1>
                <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
                <v-alert v-if="success" type="success" dismissible>{{ success }}</v-alert>
                <v-progress-circular v-if="loading" indeterminate color="blue"></v-progress-circular>
                <v-img v-if="object && !loading && object.type === 'image'" :src="`${apiUrl}${object.filePath}`" class="mt-3 mb-6" contain></v-img>
                <v-form v-if="object && !loading" @submit.prevent="updateObject">
                    <v-text-field v-model="object.position.x" label="Position X" type="number"></v-text-field>
                    <v-text-field v-model="object.position.y" label="Position Y" type="number"></v-text-field>
                    <v-text-field v-model="object.position.z" label="Position Z" type="number"></v-text-field>
                    <v-text-field v-model="object.rotation._x" label="Rotation X" type="number"></v-text-field>
                    <v-text-field v-model="object.rotation._y" label="Rotation Y" type="number"></v-text-field>
                    <v-text-field v-model="object.rotation._z" label="Rotation Z" type="number"></v-text-field>
                    <v-btn color="blue" type="submit">Save Changes</v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { fetchObjectById, updateObject } from '@/apiService.js';

export default {
    props: ['id'],
    data() {
        return {
            object: null,
            loading: true,
            error: null,
            success: null,
            apiUrl: import.meta.env.VITE_APP_API_URL,
        };
    },
    async created() {
        try {
            this.object = await fetchObjectById(this.id);
        } catch (error) {
            this.error = 'Failed to load object';
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async updateObject() {
            try {
                await updateObject(this.object._id, this.object);
                this.success = 'Changes saved successfully';
                this.error = null; // Clear any previous errors
            } catch (error) {
                this.success = null; // Clear any previous success message
                this.error = 'Failed to update object';
            }
        }
    }
}
</script>

<style scoped>
/* Add any additional styling here */
</style>
