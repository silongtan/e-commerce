<script setup lang="ts"></script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref, provide } from "vue";

import UserViewModel from "../viewModels/UserViewModel";
const user: Ref<UserViewModel | null> = ref(null);
provide("user", user);
async function refresh() {
  try {
    user.value = await (await fetch("/api/user")).json();
  } catch (error) {
    console.log(error);
  }
}
onMounted(() => {
  refresh();
});
</script>
