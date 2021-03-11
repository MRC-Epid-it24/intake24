<template>
  <v-row>
    <v-col v-if="whole">
      <v-card>
        Whole
      </v-card>
    </v-col>
    <v-col v-if="whole && fraction">
      <v-card>
        and
      </v-card>
    </v-col>
    <v-col v-if="fraction">
      <v-card>
        Fraction
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Incrementer',
  
  // Should probably fail if both are false as nothing to display
  props: {
    whole: Boolean,
    fraction: Boolean,
  },

};
</script>

<style></style>
