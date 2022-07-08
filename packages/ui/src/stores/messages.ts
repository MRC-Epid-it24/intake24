import { defineStore } from 'pinia';
import { randomString } from '@intake24/common/util';

export const messageTypes = ['info', 'success', 'warning', 'error'];

export type MessageType = typeof messageTypes[number];

export type Message = {
  id: string;
  type: MessageType;
  text: string;
  show: boolean;
  timeout: number;
};

export type MessagesState = {
  items: Message[];
};

export const useMessages = defineStore('messages', {
  state: (): MessagesState => ({ items: [] }),
  actions: {
    add(type: MessageType, text: string, timeout = 10000) {
      const item = {
        id: randomString(6),
        type,
        text,
        show: true,
        timeout,
      };

      this.items.push(item);

      return item;
    },

    info(text: string, timeout = 10000) {
      return this.add('info', text, timeout);
    },

    success(text: string, timeout = 10000) {
      return this.add('success', text, timeout);
    },

    warning(text: string, timeout = 10000) {
      return this.add('warning', text, timeout);
    },

    error(text: string, timeout = 10000) {
      return this.add('error', text, timeout);
    },

    remove(id: string) {
      this.items = this.items.filter((message) => message.id !== id);
    },

    clean() {
      this.items = this.items.filter((message) => message.show);
    },
  },
});

export type MessagesStoreDef = typeof useMessages;

export type MessagesStore = ReturnType<MessagesStoreDef>;
