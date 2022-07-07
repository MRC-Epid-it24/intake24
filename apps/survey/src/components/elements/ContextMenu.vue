<template>
  <v-menu offset-y :close-on-click="true" :close-on-content-click="true">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon x-small>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item-group color="primary">
        <v-list-item v-for="item in menu" :key="item.name" @click="onClick(item.action)">
          <v-list-item-content v-if="!item.dialog">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-else>
            <v-list-item-title>
              <confirm-dialog
                color="warning"
                :label="$t('prompts.editMeal.deleteMeal', { meal: entityName })"
                @confirm="onClick(item.action)"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text color="red" v-bind="attrs" v-on="on" small>
                    {{ $t('prompts.editMeal.deleteMeal', { meal: entityName }) }}
                  </v-btn>
                </template>
                {{ $t('prompts.mealDelete.message', { meal: entityName }) }}
              </confirm-dialog>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ConfirmDialog } from '@intake24/ui';

export default defineComponent({
  name: 'ContextMenu',

  components: { ConfirmDialog },

  props: {
    icon: String,
    menu: Array,
    dialog: Boolean,
    entityName: {
      type: String,
      default: '',
    },
  },

  data() {
    return {};
  },

  methods: {
    onClick(action: string) {
      this.$emit('context-menu-action', action);
    },
  },
});
</script>
