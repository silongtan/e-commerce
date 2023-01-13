<template>
  <div>
    <e-commerce-nav-bar />
    <b-container>
      <p>Hello {{ user }}</p>
      <b-table
        :items="orders"
        :fields="orderFormat"
        responsive="sm"
        id="order-table"
        show-empty
        emptyText="No order"
      >
        <template v-slot:cell(updateState)="{ item }">
          <span
            ><b-btn v-if="isShow(item.status)" @click="handleUpdateState(item)"
              >Update State</b-btn
            ></span
          >
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref, provide, watch, inject } from "vue";
import ECommerceNavBar from "../components/ECommerceNavBar.vue";
import UserViewModel from "../viewModels/UserViewModel";
import ProductViewModel from "../viewModels/ProductViewModel";
import OrderViewModel from "../viewModels/OrderViewModel";
import orderStatusConverter from "../utils/orderStatusConverter";
// const user: Ref<UserViewModel | null> = ref(null);

const user: Ref<UserViewModel | null> = inject("user")!;
const orders: Ref<OrderViewModel[]> = ref([]);
provide("user", user);

const orderFormat = [
  "sellerId",
  "customerId",
  {
    key: "status",
    label: "status",
    formatter: (status: number) => {
      return orderStatusConverter(status);
    },
  },
  // "confirm_status",
  "total_amount",
  {
    key: "orderItems",
    label: "orderItems",
    formatter: (items: any[]) => {
      return items
        .map((item) => `${item.productId}(${item.quantity})`)
        .join(", ");
    },
  },
  "updateState",
];

onMounted(() => {
  refresh();
});

const refresh = async () => {
  try {
    orders.value = await (await fetch(`/api/orders/`)).json();
  } catch (error) {
    console.log(error);
  }
};

const isShow = (status: number): boolean => {
  return (
    !!user.value &&
    ((user.value.roleType === 1 && [2].includes(status)) || // user can only change state to complete
      ([2, 3].includes(user.value.roleType) && [0, 1].includes(status))) // seller and admin can change state on processing and pending.
  );
};

const handleUpdateState = async (order: OrderViewModel) => {
  try {
    let newState = order.status + 1;
    console.log(newState);
    // console.log(order)

    const response = await fetch(`/api/orderChangeStatus/${order._id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ ...order, status: newState }),
    });
  } catch (error) {
    console.log(error);
  }
  refresh();
};
</script>
