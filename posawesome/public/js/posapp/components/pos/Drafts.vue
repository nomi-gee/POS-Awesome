<template>
  <v-row justify="center">
    <v-dialog v-model="draftsDialog" max-width="900px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{
            __('Select Hold Invoice')
          }}</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" class="pa-1">
                <v-data-table
                  :headers="headers"
                  :items="dialog_data"
                  item-value="name"
                  class="elevation-1"
                  show-select
                  v-model="selected"
                  single-select
                >
                  <template v-slot:[`item.posting_time`]="{ item }">
                    {{ item.posting_time.split('.')[0] }}
                  </template>
                  <template v-slot:[`item.grand_total`]="{ item }">
                    {{ currencySymbol(item.currency) }}
                    {{ formtCurrency(item.grand_total) }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark @click="close_dialog">Close</v-btn>
          <v-btn color="success" dark @click="submit_dialog">Select</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { evntBus } from '../../bus';
import format from '../../format';
export default {
  // props: ["draftsDialog"],
  mixins: [format],
  data: () => ({
    draftsDialog: false,
    singleSelect: true,
    selected: [],
    dialog_data: {},
    headers: [
      {
        title: __('Customer'),
        key: 'customer_name',
        align: 'start',
        sortable: true,
      },
      {
        title: __('Date'),
        align: 'start',
        sortable: true,
        key: 'posting_date',
      },
      {
        title: __('Time'),
        align: 'start',
        sortable: true,
        key: 'posting_time',
      },
      {
        title: __('Invoice'),
        key: 'name',
        align: 'start',
        sortable: true,
      },
      {
        title: __('Amount'),
        key: 'grand_total',
        align: 'end',
        sortable: false,
      },
    ],
  }),
  watch: {},
  methods: {
    close_dialog() {
      this.draftsDialog = false;
    },

    submit_dialog() {
      var me = this;
      if (this.selected.length == 1) {
        $.each(this.dialog_data || [], function(i,v){
          if(v.name == me.selected[0]){
            evntBus.emit('load_invoice', v);
            me.draftsDialog = false;
          }
        });
      }
      else{
        evntBus.emit("show_mesage", {
          text: `Select Only 1 Row`,
          color: "error",
        });
      }
    },
  },
  created: function () {
    evntBus.on('open_drafts', (data) => {
      this.draftsDialog = true;
      this.dialog_data = data;
    });
  },
};
</script>
