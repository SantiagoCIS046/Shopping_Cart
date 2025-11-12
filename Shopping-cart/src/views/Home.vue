<template>
  <div class="home">
    <h1>Home {{ userStore.userData }}</h1>
    <p>Bienvenido a la página principal</p>
    <q-btn color="primary" label="Ir a Login" to="/login" />
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

h1 {
  color: #1976d2;
  margin-bottom: 20px;
}
</style>
