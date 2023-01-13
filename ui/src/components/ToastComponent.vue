<template>
  <div>
    <!-- <button @click="showToast">Click me</button> -->

    <b-toast
      :id="id"
      :title="title"
      :visible="visible"
      :autoHideDelay="5000"
      :appendToast="true"
      solid
    >
      {{ message }}
    </b-toast>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ToastPlugin } from 'bootstrap-vue/src/components/toast';
// let toast = useToast()

interface Props {
  title: string;
  id: string;
  message: string;
}
const props = withDefaults(defineProps<Props>(), {
  title: 'e-commerce',
  id: 'e-commerce',
  message: 'success',
});

const visible = ref(false);

const showToast = () => {
  // show toast
  visible.value = true;
};
setTimeout(() => {
    
  visible.value = true;
}, 1000);
</script>
