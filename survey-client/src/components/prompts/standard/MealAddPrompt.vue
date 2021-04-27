<template>
	<prompt-layout :text="text" :description="description">
		 <v-form ref="form" @submit.prevent="submit">
			 <v-text-field
				 name="name"
				 label="label"
				 id="id"
			 ></v-text-field>
		 </v-form>
	</prompt-layout>

</template>

<script lang="ts">
import Vue from 'vue'
import BasePrompt, { Prompt } from '../BasePrompt';

export default Vue.extend({
	name: 'MealAddPrompt',

  mixins: [BasePrompt],

	data(){
		return
	},

	computed: {
		text(): string {
			return "Example text"
		},
		description(): string {
			return "example description"
		}
	},

	methods: {
		submit() {
			console.log('Form was submited')
			return
		}
	}

})
</script>

<style lang="scss" scoped></style>
