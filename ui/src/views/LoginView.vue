<template>
  <b-container>
    <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
      <b-card class="border-0 shadow my-5">
        <b-card-title class="text-center mb-5 fs-5">Sign In</b-card-title>
        <div class="p-3 p-sm-4">
          <b-form-group
            class="position-relative"
            id="usernameField"
            label="Username:"
            label-for="usernameInput"
          >
            <b-form-input
              class="form-control"
              id="usernameInput"
              v-model="user.username"
              placeholder="Enter username"
              required
            />
          </b-form-group>

          <b-form-group
            id="PassswordField"
            label="Password:"
            label-for="passwordInput"
          >
            <b-form-input
              class="form-control"
              type="password"
              id="passwordInput"
              v-model="user.password"
              placeholder="Enter password"
              required
              @keyup.enter.native="onLogin"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-4" v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
              v-model="user.checked"
              id="remeberPassword"
              :aria-describedby="ariaDescribedby"
            >
              <b-form-checkbox value="RemeberPassword"
                >Remember password</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-form-group>

          <div class="">
            <b-button
              @click="onLogin"
              id="signinbutton"
              type="submit"
              variant="primary"
              class="text-uppercase text-center"
              block
            >
              Sign in</b-button
            >
          </div>
          <div class="d-grid">
            <a href="/register">Register</a>
          </div>
          <hr class="my-4" /></div
      ></b-card>
    </div>
  </b-container>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
// import { useRoute } from 'vue-router/composables';

// const router = useRoute();
interface LoginForm {
  username: string;
  password: string;
  checked: string[];
}

function createEmptyLoginForm(): LoginForm {
  return {
    username: '',
    password: '',
    checked: [],
  };
}

const user: Ref<LoginForm> = ref(createEmptyLoginForm());
async function onLogin() {
  try {
    const response = await fetch('/api/login', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(user.value),
    });
    console.log(response);
    if (response.redirected) {
      // window.location.replace(response.url);

      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
}
</script>
