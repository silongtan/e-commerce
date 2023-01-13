<template>
  <div>
    <e-commerce-nav-bar />
    <b-container>
      <!-- <ToastComponent /> -->
      <p>Hello {{ user }}</p>
      <p v-if="user">{{ userRoleConverter(user.roleType) }}</p>
      <!-- <a v-if="!user" class="btn btn-primary" href="/api/login">Log In</a> -->
      <!-- <b-btn v-if="!user" href="/api/login">Log In</b-btn> -->
      <products-component
        :products="products"
        @refresh="refresh"
      ></products-component>
      <shopping-cart-component
        :cartList="cartList"
        @refresh="refresh"
      ></shopping-cart-component>
      <b-button id='placeorderbutton'
      @click="handlePlaceOrder">Place Order</b-button>
      <b-button href="/orders">My Order</b-button>
      <!-- if user is seller -->
      <b-button v-if="user && user.roleType == 2" href="/newProduct"
        >Add Product</b-button
      >
    </b-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref, provide, inject } from "vue";
import ECommerceNavBar from "../components/ECommerceNavBar.vue";
import UserViewModel from "../viewModels/UserViewModel";
import ProductViewModel from "../viewModels/ProductViewModel";
import userRoleConverter from "../utils/userRoleConverter";
import ToastComponent from "@/components/ToastComponent.vue";
import ProductsComponent from "../components/ProductsComponent.vue";
import ShoppingCartComponent from "../components/ShoppingCartComponent.vue";

import { CartItemList } from "@/viewModels/CartItemListViewModel";
import { watch } from "fs";
import { ProgressPlugin } from "bootstrap-vue";
import LoginView from "./LoginView.vue";
const user: Ref<UserViewModel | null> = ref(null);
const products: Ref<ProductViewModel[]> = ref([]);
const cartList: Ref<CartItemList> = ref([]);



// provide("user", user);

onMounted(() => {
  refresh();
});

async function refresh() {
  try {
    products.value = await (await fetch("/api/products")).json();
    // console.log(products.value)
    user.value = await (await fetch("/api/user")).json();
    // console.log(user.value)
    // try {
    cartList.value = await (await fetch("/api/cart")).json();
    console.log(cartList.value);
    // } catch (error) {
    //   console.log(error);
    // }
  } catch (error) {
    console.log(error);
  }
}

async function handlePlaceOrder() {
  // console.log(cartList.value);
  if (cartList.value.length != 0) {
    try {
      const response = await fetch("/api/addOrder", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(cartList.value),
      });
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
    refresh();
  }
}
</script>
