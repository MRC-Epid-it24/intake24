import Vue from 'vue';
import { HttpClient } from '@/types/http';

declare module 'vue/types/vue' {
  interface Vue {
    $http: HttpClient;

    // loadingMixin
    isLoading: () => boolean;
  }
}
