<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon x-small>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <v-list dense>
			<v-list-item-group color="primary">
				<v-list-item v-for="item in menu" :key="item.name" @click="onClick(item.action, itemId)">
					<v-list-item-content>
						<v-list-item-title>{{ item.name }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'ContextMenu',
  props: {
    icon: String,
    menu: Array,
		itemId: String,
  },
  data() {
    return {};
  },
	methods: {
		onClick(action: string, itemId: string | undefined) {
			console.log('Context Menu: ', action, itemId);
			const payload = { action, itemId };
			this.$emit('manual-prompt-selection', payload);
		}
	}
});
</script>
