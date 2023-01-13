<template>
  <div>
    <b-card-group columns>
      <b-card
        v-for="product in products"
        :key="product._id"
        :title="product.title"
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        style="max-width: 20rem"
        class="mb-2"
      >
        <b-card-text>
          {{ product.description }}
        </b-card-text>

        <b-button @click="handleClickAddCart(product)" variant="primary"
          >Add Cart</b-button
        >
        <b-button :href="`/product/${product._id}`" variant="primary"
          >Detail</b-button
        >

        <!-- v-if="!user || user.roleType === UserRole.Buyer"
        
        <b-button
        @click="handleDeleteProduct(product._id)"
        variant="primary"
        v-else
        >Delete Product</b-button
      > -->
        <div class="float-right">
          <h5>
            <b-badge variant="light " pill> ${{ product.salePrice }}</b-badge>
          </h5>
        </div>
      </b-card></b-card-group
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
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref, provide, watch, inject } from "vue";
import UserViewModel from "../viewModels/UserViewModel";
import ProductViewModel from "../viewModels/ProductViewModel";
import OrderViewModel from "../viewModels/OrderViewModel";
import orderStatusConverter from "../utils/orderStatusConverter";
import {
  CartItem,
  createEmptyCartItem,
} from "../viewModels/CartItemListViewModel";

// const products: Ref<IProductModel[]> = ref([]);
const user: Ref<UserViewModel | null> = inject("user")!;
// const orders: Ref<any[]> = ref([]);
const modalShow: Ref<boolean> = ref(false);

const addCart: Ref<CartItem> = ref(createEmptyCartItem());
const quantityValidator = computed(() => {
  return addCart.value.quantity > 0;
});

interface Props {
  products: ProductViewModel[];
}
// default values for props
const props = withDefaults(defineProps<Props>(), {
  products: () => [],
});

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

function refresh() {
  emit("refresh");
}

const handleDeleteProduct = async (productId: string) => {
  try {
    await fetch(`/api/deleteProduct/${encodeURIComponent(productId)}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    refresh();
  } catch (error) {
    console.log(error);
  }
};

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
</script>
