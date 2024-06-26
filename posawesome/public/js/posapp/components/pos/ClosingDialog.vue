<template>
  <v-row justify="center">
    <v-dialog v-model="closingDialog" max-width="900px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{ __('Closing POS Shift') }}</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row>
              <v-col cols="12" class="pa-1">
                <v-data-table
                  :headers="headers"
                  :items="dialog_data.payment_reconciliation"
                  item-key="mode_of_payment"
                  class="elevation-1"
                  :items-per-page="itemsPerPage"
                  hide-default-footer
                >
                  <template v-slot:[`item.closing_amount`]="{ item }">
                    {{ currencySymbol(pos_profile.currency) }}
                    <div v-if="item.editing">
                      <v-text-field
                        v-model="item.closing_amount"
                        :rules="[max25chars]"
                        :label="__('Edit')"
                        single-line
                        counter
                        type="number"
                        @blur="item.editing = false"
                      ></v-text-field>
                    </div>
                    <div v-else @click="item.editing = true">
                      {{ formtCurrency(item.closing_amount) }}
                    </div>
                  </template>
                  <template v-slot:[`item.difference`]="{ item }">
                    {{ currencySymbol(pos_profile.currency) }}
                    {{
                      (item.difference = formtCurrency(
                        item.expected_amount - item.closing_amount
                      ))
                    }}
                  </template>
                  <template v-slot:[`item.opening_amount`]="{ item }">
                    {{ currencySymbol(pos_profile.currency) }}
                    {{ formtCurrency(item.opening_amount) }}
                  </template>
                  <template v-slot:[`item.expected_amount`]="{ item }">
                    {{ currencySymbol(pos_profile.currency) }}
                    {{ formtCurrency(item.expected_amount) }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark @click="close_dialog">
            {{ __('Close') }}
          </v-btn>
          <v-btn color="success" dark @click="submit_dialog">
            {{ __('Submit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { ref, onMounted } from 'vue';
import { evntBus } from '../../bus';
import format from '../../format';

export default {
  mixins: [format],
  setup() {
    const closingDialog = ref(false);
    const itemsPerPage = ref(20);
    const dialog_data = ref({ payment_reconciliation: [] });
    const pos_profile = ref('');
    const headers = ref([
      {
        title: __('Mode of Payment'),
        key: 'mode_of_payment',
        align: 'start',
        sortable: true,
      },
      {
        title: __('Opening Amount'),
        align: 'end',
        sortable: true,
        key: 'opening_amount',
      },
      {
        title: __('Closing Amount'),
        key: 'closing_amount',
        align: 'end',
        sortable: true,
      },
    ]);
    const max25chars = (v) => v.length <= 20 || 'Input too long!';

    const close_dialog = () => {
      closingDialog.value = false;
    };

    const submit_dialog = () => {
      evntBus.emit('submit_closing_pos', dialog_data.value);
      closingDialog.value = false;
    };

    onMounted(() => {
      evntBus.on('open_ClosingDialog', (data) => {
        closingDialog.value = true;
        dialog_data.value = data;
      });
      evntBus.on('register_pos_profile', (data) => {
        pos_profile.value = data.pos_profile;
        if (!pos_profile.value.hide_expected_amount) {
          headers.value.push({
            title: __('Expected Amount'),
            key: 'expected_amount',
            align: 'end',
            sortable: false,
          });
          headers.value.push({
            title: __('Difference'),
            key: 'difference',
            align: 'end',
            sortable: false,
          });
        }
      });
    });

    return {
      closingDialog,
      itemsPerPage,
      dialog_data,
      pos_profile,
      headers,
      max25chars,
      close_dialog,
      submit_dialog,
    };
  },
};
</script>

<style scoped>
.margen-top {
  margin-top: 0px;
}
</style>
