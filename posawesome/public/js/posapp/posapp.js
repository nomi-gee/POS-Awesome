import { createApp } from 'vue';
import Home from './Home.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import {
  // Layout
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VNavigationDrawer,
  VFooter,
  VToolbar,
  VToolbarTitle,

  // Data display
  VAlert,
  VAvatar,
  VBadge,
  VBanner,
  VBottomNavigation,
  VBottomSheet,
  VBreadcrumbs,
  VBreadcrumbsItem,
  VBtn,
  VBtnToggle,
  VCard,
  VCardActions,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VCarousel,
  VCarouselItem,
  VCheckbox,
  VChip,
  VChipGroup,
  VColorPicker,
  VCombobox,
  VCounter,
  VDataTable,
  VDialog,
  VDivider,
  VExpansionPanel,
  VForm,
  VIcon,
  VImg,
  VInput,
  VItemGroup,
  VLabel,
  VList,
  VListGroup,
  VListItem,
  VListItemAction,
  VListItemSubtitle,
  VListItemTitle,
  VMain,
  VMenu,
  VMessages,
  VPagination,
  VParallax,
  VProgressCircular,
  VProgressLinear,
  VRadio,
  VRadioGroup,
  VRating,
  VResponsive,
  VRow,
  VCol,
  VSelect,
  VSheet,
  VSlider,
  VSnackbar,
  VSpacer,
  VSpeedDial,
  VStepper,
  VSwitch,
  VSystemBar,
  VTabs,
  VTab,
  VTextarea,
  VTextField,
  VTimeline,
  VTimelineItem,
  VTooltip,
  VWindow,

  // Utilities
  VDatePicker,

  // Directives
  VHover,
  VContainer,
  VAutocomplete,
  VConfirmEdit

} from 'vuetify/components';
import translationPlugin from './translation'


frappe.provide('frappe.PosApp');

frappe.PosApp.posapp = class {
    constructor({ parent }) {
        this.$parent = $(document);
        this.page = parent.page;
        this.make_body();
    }

    make_body() {
        this.$el = this.$parent.find('.main-section');

        const vuetify = createVuetify({
            components: {
                // Layout
                  VChipGroup,
                  VConfirmEdit,
                  VAutocomplete,
                  VApp,
                  VAppBar,
                  VAppBarNavIcon,
                  VAppBarTitle,
                  VNavigationDrawer,
                  VFooter,
                  VToolbar,
                  VToolbarTitle,

                  // Data display
                  VAlert,
                  VAvatar,
                  VBadge,
                  VBanner,
                  VBottomNavigation,
                  VBottomSheet,
                  VBreadcrumbs,
                  VBreadcrumbsItem,
                  VBtn,
                  VBtnToggle,
                  VCard,
                  VCardActions,
                  VCardSubtitle,
                  VCardText,
                  VCardTitle,
                  VCarousel,
                  VCarouselItem,
                  VCheckbox,
                  VChip,
                  VColorPicker,
                  VCombobox,
                  VCounter,
                  VDataTable,
                  VDialog,
                  VDivider,
                  VExpansionPanel,
                  VForm,
                  VIcon,
                  VImg,
                  VInput,
                  VItemGroup,
                  VLabel,
                  VList,
                  VListGroup,
                  VListItem,
                  VListItemAction,
                  VListItemSubtitle,
                  VListItemTitle,
                  VMain,
                  VMenu,
                  VMessages,
                  VPagination,
                  VParallax,
                  VProgressCircular,
                  VProgressLinear,
                  VRadio,
                  VRadioGroup,
                  VRating,
                  VResponsive,
                  VRow,
                  VCol,
                  VSelect,
                  VSheet,
                  VSlider,
                  VSnackbar,
                  VSpacer,
                  VSpeedDial,
                  VStepper,
                  VSwitch,
                  VSystemBar,
                  VTabs,
                  VTab,
                  VTextarea,
                  VTextField,
                  VTimeline,
                  VTimelineItem,
                  VTooltip,
                  VWindow,

                  // Utilities
                  VDatePicker,

                  // Directives
                  VHover,
                  VContainer
            },
            theme: {
                themes: {
                    light: {
                        background: '#FFFFFF',
                        primary: '#0097A7',
                        secondary: '#00BCD4',
                        accent: '#9575CD',
                        success: '#66BB6A',
                        info: '#2196F3',
                        warning: '#FF9800',
                        error: '#E86674',
                        orange: '#E65100',
                        golden: '#A68C59',
                        badge: '#F5528C',
                        customPrimary: '#085294',
                    },
                },
            },
        });

        const app = createApp(Home);

        app.use(vuetify);
        SetVueGlobals(app);
        app.mount(this.$el[0]);
    }

    setup_header() {
        // Implement header setup logic here
    }
};
