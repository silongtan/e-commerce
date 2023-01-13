<template>
  <b-container>
    <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
      <b-card class="border-0 shadow my-5">
        <div class="p-3 p-sm-4">
          <b-card-title class="text-center mb-5 fs-5">Sign Up</b-card-title>

          <b-form-group
            class="position-relative"
            id="usernameField"
            label="Username:"
            label-for="usernameInput"
          >
            <b-form-input
              class="form-control"
              id="usernameInput"
              v-model="registerForm.username"
              placeholder="Enter username"
              required
            />
          </b-form-group>
          <b-form-group
            class="position-relative"
            id="emailField"
            label="Email:"
            label-for="emailInput"
          >
            <b-form-input
              class="form-control"
              id="emailInput"
              v-model="registerForm.email"
              placeholder="Enter email"
              required
            />
          </b-form-group>

          <b-form-group
            id="PassswordField"
            label="Password:"
            label-for="passportInput"
          >
            <b-form-input
              class="form-control"
              type="password"
              id="passportInput"
              v-model="registerForm.password"
              placeholder="Enter password"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="PassswordField2"
            label="Re-enter your password:"
            label-for="passportInput2"
          >
            <b-form-input
              class="form-control"
              type="password"
              id="passportInput2"
              v-model="registerForm.password2"
              placeholder="Enter password"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="roleTypeField"
            label="Choose your role: "
            label-for="roleTypeInput"
          >
            <b-form-select
              class="form-control"
              :options="options"
              id="roleTypeInput"
              v-model="registerForm.roleType"
              required
            ></b-form-select>
          </b-form-group>

          <p>
            By creating an account you agree to our
            <a href="#">Terms & Privacy</a>.
          </p>
          <div class="">
            <b-button
              @click="onRegister"
              type="submit"
              variant="primary"
              class="text-uppercase text-center"
              block
            >
              Register</b-button
            >
          </div>
          <div class="d-grid">
            <p>Already have an account?<a href="/login">Login</a></p>
          </div>
          <hr class="my-4" /></div
      ></b-card>
    </div>
  </b-container>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import User, { IUserModel } from "../../../server/models/User";
interface RegisterForm {
  username: string;
  password: string;
  password2: string;
  email: string;
  roleType: number;
}

function createEmptyRegisterForm(): RegisterForm {
  return {
    username: "",
    password: "",
    password2: "",
    email: "",
    roleType: 1,
  };
}
const options = [
  { value: 1, text: "Buyer" },
  { value: 2, text: "Seller" },
];
const registerForm: Ref<RegisterForm> = ref(createEmptyRegisterForm());
async function onRegister() {
  try {
    const response = await fetch("/api/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(registerForm.value),
    });
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.log(error);
  }
}
</script>
