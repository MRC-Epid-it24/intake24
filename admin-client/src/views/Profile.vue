<template>
  <v-container>
    <v-card outlined>
      <v-card-text>
        <v-simple-table>
          <tbody>
            <tr>
              <th v-t="'users.name'"></th>
              <td>{{ profile.name }}</td>
            </tr>
            <tr>
              <th v-t="'users.roles'"></th>
              <td>{{ profile.roles ? profile.roles.join(', ') : '' }}</td>
            </tr>
            <tr>
              <th v-t="'users.email'"></th>
              <td>{{ profile.email }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Profile',

  computed: mapGetters('user', ['profile']),
});
</script>
