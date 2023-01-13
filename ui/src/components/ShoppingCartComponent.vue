<template>
  <div v-if="!user || user.roleType == 1">
    <h3>Shopping Cart:</h3>
    <b-table
      :items="cartList"
      :fields="cartFormat"
      id="order-table"
      responsive="sm"
      show-empty
      emptyText="No items in shopping cart"
    >
      <template #cell(index)="data">
        {{ data.index + 1 }}
        <!-- <b-btn @click="test(data)">Edit</b-btn> -->
      </template>
      <template #cell(quantity)="data">
        <b-form-input
          type="number"
          v-model="data.item.quantity"
          :readOnly="readOnlyList[data.index]"
        />
      </template>
      <!-- <template v-slot:cell(action)="{ item }">
        
      </template> -->
      <template #cell(action)="data"
        ><span
          ><b-btn @click="handleDeleteItem(data.item.productId)"
            >Delete</b-btn
          ></span
        ><span v-if="readOnlyList[data.index]"
          ><b-button @click="handleClickEdit(data.index, false)"
            >Edit</b-button
          ></span
        ><span
          ><b-btn
            v-if="!readOnlyList[data.index]"
            @click="handleUpdateItem(data.index, data.item)"
            >Update</b-btn
          ></span
        ></template
      >
    </b-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref, provide, watch, inject } from "vue";
import UserViewModel from "../viewModels/UserViewModel";
import ProductViewModel from "../viewModels/ProductViewModel";
import OrderViewModel from "../viewModels/OrderViewModel";
import orderStatusConverter from "../utils/orderStatusConverter";
import { CartItemList } from "@/viewModels/CartItemListViewModel";

const user: Ref<UserViewModel | null> = inject("user")!;

// const cartList: Ref<CartItemList> = ref([]);
interface Props {
  cartList: CartItemList;
}
// default values for props
const props = withDefaults(defineProps<Props>(), {
  cartList: () => [],
});
// const readonlyList = computed(() =>
//   new Array(props.cartList.length).fill(true)
// );
// const initReadonlyList = () => {
//   // readonlyList = ref(new Array(props.cartList.length).fill(true));

//   for (let i = 0; i < props.cartList.length; i++) {
//     console.log("test");
//     readonlyList.value.push(true);
//   }
// };
// watch(props.cartList, initReadonlyList, { immediate: true });

// const len = computed(()=>{
//   console.log(props.cartList.length)
//   return props.cartList.length

// })

// const readOnly: Ref<boolean> = ref(true);

// watch(() => props.cartList, refresh);
// interface UpdateItem {
//   productId: string;
//   quantity: number;
// }
// function createEmptyUpdateItem() {
//   return { productId: '', quantity: 0 };
// }
// const updatedItem: Ref<UpdateItem> = ref(createEmptyUpdateItem());

const cartFormat = [
  {
    key: "index",
    label: "#",
  },
  "productId",
  "title",
  "quantity",
  "action",
];

const handleDeleteItem = async (productId: string) => {
  try {
    const response = await fetch(`/api/deleteCart/${productId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
  } catch (error) {
    console.log(error);
  }
  refresh();
};

// shopping cart max 256
const readOnlyList: Ref<boolean[]> = ref(new Array(256).fill(true));
const handleClickEdit = (index: number, readOnly: boolean) => {
  try {
    readOnlyList.value.splice(index, 1, readOnly);
  } catch (error) {
    console.log(error);
  }
};

const handleUpdateItem = async (
  index: number,
  newItem: { productId: string; quantity: number }
) => {
  try {
    const response = await fetch(`/api/updateCart`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        productId: newItem.productId,
        quantity: newItem.quantity,
      }),
    });
  } catch (error) {
    console.log(error);
  }
  handleClickEdit(index, true);
  refresh();
};

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

function refresh() {
  emit("refresh");
}
</script>
