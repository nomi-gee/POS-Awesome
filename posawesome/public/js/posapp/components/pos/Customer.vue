<template>
  <div>
    <v-autocomplete
      density="compact"
      variant="outlined"
      color="primary"
      :label="__('Customer')"
      v-model="customer"
      :items="customers"
      item-title="customer_name"
      item-value="name"
      :filter="customFilter"
      :disabled="readonly"
      append-icon="mdi-plus"
      @click:append="new_customer"
      prepend-inner-icon="mdi-account-edit"
      @click:prepend-inner="edit_customer"
    >
      <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            >
            <v-list-item-title
              class="primary--text subtitle-1"
              v-html="item.customer_name"
            ></v-list-item-title>
            <v-list-item-subtitle
              v-if="item.customer_name != item.name"
              v-html="`ID: ${item.name}`"
            ></v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="item.tax_id"
              v-html="`TAX ID: ${item.tax_id}`"
            ></v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="item.email_id"
              v-html="`Email: ${item.email_id}`"
            ></v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="item.mobile_no"
              v-html="`Mobile No: ${item.mobile_no}`"
            ></v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="item.primary_address"
              v-html="`Primary Address: ${item.primary_address}`"
            ></v-list-item-subtitle>
          </v-list-item>
      </template>
    </v-autocomplete>
    <div class="mb-8">
      <UpdateCustomer></UpdateCustomer>
    </div>
  </div>
</template>

<script>
import { evntBus } from '../../bus';
import UpdateCustomer from './UpdateCustomer.vue';
export default {
  data: () => ({
    pos_profile: '',
    customers: [],
    customer: '',
    readonly: false,
    customer_info: {},
  }),

  components: {
    UpdateCustomer,
  },

  methods: {
    get_customer_names() {
      const vm = this;
      if (this.customers.length > 0) {
        return;
      }
      if (vm.pos_profile.posa_local_storage && localStorage.customer_storage) {
        vm.customers = JSON.parse(localStorage.getItem('customer_storage'));
      }
      frappe.call({
        method: 'posawesome.posawesome.api.posapp.get_customer_names',
        args: {
          pos_profile: this.pos_profile.pos_profile,
        },
        callback: function (r) {
          if (r.message) {
            vm.customers = r.message;
            console.info('loadCustomers');
            if (vm.pos_profile.posa_local_storage) {
              localStorage.setItem('customer_storage', '');
              localStorage.setItem(
                'customer_storage',
                JSON.stringify(r.message)
              );
            }
          }
        },
      });
    },
    new_customer() {
      evntBus.emit('open_update_customer', null);
    },
    edit_customer() {
      evntBus.emit('open_update_customer', this.customer_info);
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.customer_name
        ? item.customer_name.toLowerCase()
        : '';
      const textTwo = item.tax_id ? item.tax_id.toLowerCase() : '';
      const textThree = item.email_id ? item.email_id.toLowerCase() : '';
      const textFour = item.mobile_no ? item.mobile_no.toLowerCase() : '';
      const textFifth = item.name.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1 ||
        textThree.indexOf(searchText) > -1 ||
        textFour.indexOf(searchText) > -1 ||
        textFifth.indexOf(searchText) > -1
      );
    },
  },

  computed: {},

  created: function () {
    this.$nextTick(function () {
      evntBus.on('register_pos_profile', (pos_profile) => {
        this.pos_profile = pos_profile;
        this.get_customer_names();
      });
      evntBus.on('payments_register_pos_profile', (pos_profile) => {
        this.pos_profile = pos_profile;
        this.get_customer_names();
      });
      evntBus.on('set_customer', (customer) => {
        this.customer = customer;
      });
      evntBus.on('add_customer_to_list', (customer) => {
        this.customers.push(customer);
      });
      evntBus.on('set_customer_readonly', (value) => {
        this.readonly = value;
      });
      evntBus.on('set_customer_info_to_edit', (data) => {
        this.customer_info = data;
      });
      evntBus.on('fetch_customer_details', () => {
        this.get_customer_names();
      });
    });
  },

  watch: {
    customer() {
      evntBus.emit('update_customer', this.customer);
    },
  },
};
</script>
