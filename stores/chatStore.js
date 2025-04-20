import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    chats: [],
    loaded: false,
  }),
  actions: {
    async fetchChats() {
      if (this.loaded) return;
      const res = await $fetch("https://dummyjson.com/c/5c9a-2b01-4cee-b469");
      this.chats = res;
      this.loaded = true;
    },
    sendMessage(chatId, message) {
      const chat = this.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.messages.push({
          id: `message-${Date.now()}`,
          content: message,
          isInbox: false,
          sentAt: new Date().toISOString(),
        });
      }
    },
  },
});
