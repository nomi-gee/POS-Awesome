<template>
  <nav>
    <v-app-bar app height="40" class="elevation-2">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="grey--text"></v-app-bar-nav-icon>
      <v-img src="/assets/posawesome/js/posapp/components/pos/pos.png" alt="POS Awesome" max-width="32" class="mr-2" color="primary"></v-img>
      <v-toolbar-title @click="go_desk" style="cursor: pointer" class="text-uppercase primary--text">
        <span class="font-weight-light">pos</span>
        <span>awesome</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn style="cursor: unset" text color="primary">
        <span right>{{ pos_profile.name }}</span>
      </v-btn>
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark text v-bind="attrs" v-on="on">Menu</v-btn>
          </template>
          <v-card class="mx-auto" max-width="300" tile>
            <v-list dense>
              <v-list-item-group v-model="menu_item" color="primary">
                <v-list-item @click="close_shift_dialog" v-if="!pos_profile.posa_hide_closing_shift && item == 0">
                  <v-list-item-icon>
                    <v-icon>mdi-content-save-move-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ __('Close Shift') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="print_last_invoice" v-if="pos_profile.posa_allow_print_last_invoice && this.last_invoice">
                  <v-list-item-icon>
                    <v-icon>mdi-printer</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ __('Print Last Invoice') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="my-0"></v-divider>
                <v-list-item @click="logOut">
                  <v-list-item-icon>
                    <v-icon>mdi-logout</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ __('Logout') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="go_about">
                  <v-list-item-icon>
                    <v-icon>mdi-information-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ __('About') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" app class="primary margen-top" width="170">
      <v-list dark>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img :src="company_img"></v-img>
          </v-list-item-avatar>

          <v-list-item-title>{{ company }}</v-list-item-title>

          <v-btn icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item-group v-model="item" color="white">
          <v-list-item v-for="item in items" :key="item.text" @click="changePage(item.text)">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-snackbar v-model="snack" :timeout="5000" :color="snackColor" top right>
      {{ snackText }}
    </v-snackbar>
    <v-dialog v-model="freeze" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          {{ freezeTitle }}
        </v-card-title>
        <v-card-text>{{ freezeMsg }}</v-card-text>
      </v-card>
    </v-dialog>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { evntBus } from '../bus';

export default {
  setup() {
    const drawer = ref(false);
    const mini = ref(true);
    const item = ref(0);
    const items = ref([{ text: 'POS', icon: 'mdi-network-pos' }]);
    const menu_item = ref(0);
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
          if (!r.exc) {
            frappe.set_route('/login');
            location.reload();
          }
        },
      });
    };

    const print_last_invoice = () => {
      if (!last_invoice.value) return;
      const print_format = pos_profile.value.print_format_for_online || pos_profile.value.print_format;
      const letter_head = pos_profile.value.letter_head || 0;
      const url = `${frappe.urllib.get_base_url()}/printview?doctype=Sales%20Invoice&name=${last_invoice.value}&trigger_print=1&format=${print_format}&no_letterhead=${letter_head}`;
      const printWindow = window.open(url, 'Print');
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    };

    onMounted(() => {
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
    });

    onUnmounted(() => {
      evntBus.off('show_mesage', show_mesage);
    });

    return {
      drawer,
      mini,
      item,
      items,
      menu_item,
      snack,
      snackColor,
      snackText,
      company,
      company_img,
      pos_profile,
      freeze,
      freezeTitle,
      freezeMsg,
      last_invoice,
      changePage,
      go_desk,
      go_about,
      close_shift_dialog,
      logOut,
      print_last_invoice,
    };
  },
};
</script>

<style scoped>
.margen-top {
  margin-top: 0px;
}
</style