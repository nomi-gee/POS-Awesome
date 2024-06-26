<template>
  <nav>
    <v-app-bar height="40" elevation="2">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="grey--text" />
      <v-img
        src="/assets/posawesome/js/posapp/components/pos/pos.png"
        alt="POS Awesome"
        max-width="32"
        class="mr-2"
        color="primary"
      />
      <v-toolbar-title
        @click="go_desk"
        style="cursor: pointer"
        class="text-uppercase primary--text"
      >
        <span class="font-weight-light">pos</span>
        <span>awesome</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn style="cursor: unset" variant="text" color="primary">
        <span right>{{ pos_profile.name }}</span>
      </v-btn>
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ props: menuProps }">
            <v-btn color="primary" dark variant="text" v-bind="menuProps">Menu</v-btn>
          </template>
          <v-card class="mx-auto" max-width="300" tile>
            <v-list density="compact">
              <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                @click="item.action"
              >
                <v-icon>{{ item.icon }}</v-icon>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app class="primary margen-top" width="170">
      <v-list>
        <v-list-item class="px-2">
          <v-avatar>
            <v-img :src="company_img"></v-img>
          </v-avatar>

          <v-list-item-title>{{ company }}</v-list-item-title>

          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="changePage(item.text)"
        >
          <v-list-item-title><v-icon>{{ item.icon }}</v-icon> {{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-snackbar v-model:active="snack" :timeout="5000" :color="snackColor" location="top right">
      {{ snackText }}
    </v-snackbar>
    <v-dialog v-model="freeze" persistent max-width="290">
      <v-card>
        <v-card-title>{{ freezeTitle }}</v-card-title>
        <v-card-text>{{ freezeMsg }}</v-card-text>
      </v-card>
    </v-dialog>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { evntBus } from '../bus';

const drawer = ref(false);
const mini = ref(true);
const item = ref(0);
const items = ref([{ text: 'POS', icon: 'mdi-network-pos' }]);
const snack = ref(false);
const snackColor = ref('');
const snackText = ref('');
const company = ref('POS Awesome');
const company_img = ref('/assets/erpnext/images/erpnext-logo.svg');
const pos_profile = ref('');
const freeze = ref(false);
const freezeTitle = ref('');
const freezeMsg = ref('');
const last_invoice = ref('');

const changePage = (key) => {
  evntBus.emit('changePage', key);
};

const go_desk = () => {
  frappe.set_route('/');
  location.reload();
};

const go_about = () => {
  const win = window.open('https://github.com/yrestom/POS-Awesome', '_blank');
  win.focus();
};

const close_shift_dialog = () => {
  evntBus.emit('open_closing_dialog');
};

const show_mesage = (data) => {
  snack.value = true;
  snackColor.value = data.color;
  snackText.value = data.text;
};

const logOut = () => {
  frappe.call({
    method: 'logout',
    callback: function (r) {
      if (r.exc) {
        return;
      }
      frappe.set_route('/login');
      location.reload();
    },
  });
};

const print_last_invoice = () => {
  if (!last_invoice.value) return;
  const print_format =
    pos_profile.value.print_format_for_online || pos_profile.value.print_format;
  const letter_head = pos_profile.value.letter_head || 0;
  const url =
    frappe.urllib.get_base_url() +
    '/printview?doctype=Sales%20Invoice&name=' +
    last_invoice.value +
    '&trigger_print=1' +
    '&format=' +
    print_format +
    '&no_letterhead=' +
    letter_head;
  const printWindow = window.open(url, 'Print');
  printWindow.addEventListener(
    'load',
    function () {
      printWindow.print();
    },
    true
  );
};

const menuItems = ref([
  {
    text: 'Close Shift',
    icon: 'mdi-content-save-move-outline',
    action: close_shift_dialog,
    condition: !pos_profile.value.posa_hide_closing_shift,
  },
  {
    text: 'Print Last Invoice',
    icon: 'mdi-printer',
    action: print_last_invoice,
    condition: pos_profile.value.posa_allow_print_last_invoice && last_invoice.value,
  },
  {
    text: 'Logout',
    icon: 'mdi-logout',
    action: logOut,
  },
  {
    text: 'About',
    icon: 'mdi-information-outline',
    action: go_about,
  },
]);

evntBus.on('show_mesage', show_mesage);
evntBus.on('set_company', (data) => {
  company.value = data.name;
  company_img.value = data.company_logo ? data.company_logo : company_img.value;
});
evntBus.on('register_pos_profile', (data) => {
  pos_profile.value = data.pos_profile;
  const payments = { text: 'Payments', icon: 'mdi-cash-register' };
  if (pos_profile.value.posa_use_pos_awesome_payments && items.value.length !== 2) {
    items.value.push(payments);
  }
});
evntBus.on('set_last_invoice', (data) => {
  last_invoice.value = data;
});
evntBus.on('freeze', (data) => {
  freeze.value = true;
  freezeTitle.value = data.title;
  freezeMsg.value = data.msg;
});
evntBus.on('unfreeze', () => {
  freeze.value = false;
  freezeTitle.value = '';
  freezeMsg.value = '';
});
</script>

<style scoped>
.margen-top {
  margin-top: 0px;
}
</style>
