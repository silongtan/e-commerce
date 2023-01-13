<template>
  <!-- <div v-if="user && user.roleType === UserRole.Buyer">
    No access to this page
  </div> -->
  <div>
    <e-commerce-nav-bar />
    <b-container>
      <b-form-group
        id="productField"
        label="product Id:"
        label-for="productId"
        description="This product id"
      >
        <b-form-input
          id="productId"
          v-model="product._id"
          placeholder="productId cannot change. "
          required
          readonly
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="sellerIdField"
        label="seller Id:"
        label-for="sellerId"
        description="This is the seller of this product"
      >
        <b-form-input
          id="sellerId"
          v-model="product.sellerId"
          placeholder="sellerId cannot change. "
          required
          readonly
        ></b-form-input>
      </b-form-group>

      <b-form-group id="titleField" label="Title" label-for="titleInput">
        <b-form-input
          id="titleInput"
          v-model="product.title"
          placeholder="Enter title"
          required
          :readonly="readOnly"
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
          :readonly="readOnly"
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
          :readonly="readOnly"
        ></b-form-input>
      </b-form-group>

      <b-form-group
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
          :disabled="readOnly"
        ></b-form-select>
      </b-form-group>
    </b-container>

    <div class="text-center">
      <b-button @click="handleClickAddCart(product)" variant="primary"
        >Add Cart</b-button
      >
      <span v-if="(readOnly && (product.sellerId == user?.id || (user && user.roleType ===3)))"
        ><b-button @click="handleClickEdit(false)" variant="primary"
          >Edit</b-button
        ></span
      ><span
        ><b-btn v-if="!readOnly" @click="handleUpdateItem">Update</b-btn></span
      >
      <b-modal
        :id="`quantity-modal`"
        :title="`${addCart.title || ''} quantity`"
        ref="modal"
        v-model="modalShow"
        @ok.prevent="handleAddCart"
      >
        <b-form-group
          label="Please enter quantity:"
          label-for="name-input"
          invalid-feedback="Quantity invalid"
          :state="quantityValidator"
        >
          <b-form-input
            id="name-input"
            v-model="addCart.quantity"
            :state="quantityValidator"
            type="number"
            required
          ></b-form-input
        ></b-form-group>
      </b-modal>
    </div>
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
import {
  CartItem,
  createEmptyCartItem,
} from "../viewModels/CartItemListViewModel";

interface Props {
  productId: string;
}
const user: Ref<UserViewModel | null> = inject("user")!;
const props = withDefaults(defineProps<Props>(), {
  productId: "",
});

const product: Ref<ProductViewModel> = ref(createEmptyProduct());
const readOnly: Ref<boolean> = ref(true);
const addCart: Ref<CartItem> = ref(createEmptyCartItem());
const modalShow: Ref<boolean> = ref(false);
const isActiveOptions = [
  { value: true, text: "true" },
  { value: false, text: "false" },
];

onMounted(() => {
  refresh();
});
const handleClickEdit = (newReadOnly: boolean) => {
  readOnly.value = newReadOnly;
};
async function refresh() {
  try {
    product.value = await (
      await fetch(`/api/products/${props.productId}`)
    ).json();
  } catch (error) {
    console.log(error);
  }
}
const quantityValidator = computed(() => {
  return addCart.value.quantity > 0;
});
const handleClickAddCart = (product: ProductViewModel) => {
  modalShow.value = !modalShow.value;
  addCart.value.productId = product._id;
  addCart.value.title = product.title;
  addCart.value.sellerId = product.sellerId;
  addCart.value.unitPrice = product.salePrice;
};
const handleAddCart = async () => {
  if (quantityValidator.value) {
    try {
      await fetch("/api/addCart", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(addCart.value),
      });
      modalShow.value = !quantityValidator.value;
      refresh();
    } catch (error) {
      console.log(error);
    }
  }
};

const handleUpdateItem = async () => {
  console.log({...product.value})
  try {
    const response = await fetch(`/api/updateProduct`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ ...product.value }),
    });
  } catch (error) {
    console.log(error);
  }
  handleClickEdit(true);
  refresh();
};
</script>
