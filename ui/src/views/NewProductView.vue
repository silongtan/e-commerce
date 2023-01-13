<template>
  <!-- <div v-if="user && user.roleType === UserRole.Buyer">
      No access to this page
    </div> -->
  <div>
    <e-commerce-nav-bar />
    <b-container>
      <b-form-group id="titleField" label="Title" label-for="titleInput">
        <b-form-input
          id="titleInput"
          v-model="product.title"
          placeholder="Enter title"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="descriptionField"
        label="description"
        label-for="descriptionInput"
        description="This is the description of this product"
      >
        <b-form-textarea
          id="descriptionInput"
          v-model="product.description"
          placeholder="Enter description"
        ></b-form-textarea>
      </b-form-group>

      <b-form-group
        id="salePriceField"
        label="salePrice"
        label-for="salePriceInput"
        description="This is the salePrice of this product"
      >
        <b-form-input
          id="salePriceInput"
          v-model="product.salePrice"
          placeholder="Enter sale price"
          type="number"
          required
        ></b-form-input>
      </b-form-group>
      <b-btn @click="handleAddProduct">Add Product</b-btn>

      <!-- <b-form-group
          id="isActiveField"
          label="isActive"
          label-for="isActiveInput"
          description="This is the isActive of this product"
        >
          <b-form-select
            id="isActiveInput"
            v-model="product.isActive"
            :options="isActiveOptions"
            placeholder="Enter"
            required
            :disabled="readonly"
          ></b-form-select>
        </b-form-group> -->
    </b-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref, provide, inject } from "vue";
import ECommerceNavBar from "../components/ECommerceNavBar.vue";
import UserViewModel from "../viewModels/UserViewModel";
import ProductViewModel, {
  createEmptyProduct,
} from "../viewModels/ProductViewModel";
import OrderViewModel from "../viewModels/OrderViewModel";
import ToastComponent from "@/components/ToastComponent.vue";
import ProductsComponent from "../components/ProductsComponent.vue";
import userRoleConverter from "../utils/userRoleConverter";

interface Props {
  productId: string;
}
const user: Ref<UserViewModel | null> = inject("user")!;
const props = withDefaults(defineProps<Props>(), {
  productId: "",
});
interface ProductDto {
  sellerId: string;
  title: string;
  description: string;
  salePrice: number;
  isActive: boolean;
}

const product: Ref<ProductDto> = ref(createEmptyProduct());

const handleAddProduct = async () => {
  try {
    const response = await fetch("/api/addProduct", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        title: product.value.title,
        description: product.value.description,
        salePrice: product.value.salePrice,
        isActive: true,
      }),
    });
    if (response.ok){
      window.location.href = "http://localhost:8080/";
    }
    console.log(response)
  } catch (error) {
    console.log(error);
  }
};
</script>
