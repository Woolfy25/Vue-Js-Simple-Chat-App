<template>
  <div class="grid grid-cols-4 h-screen">
    <div class="col-span-1 border-r-2 border-gray-300 flex flex-col">
      <div class="p-6 border-b-2 border-gray-300">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Active Conversations</h2>
          <p
            class="text-sm font-bold p-1 rounded-xs bg-gray-200 w-[28px] h-[28px] text-center"
          >
            {{ chatStore.chats.length }}
          </p>
        </div>
      </div>

      <div class="p-4">
        <div class="relative">
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full p-2 border border-gray-200 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-sm"
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 pt-0">
        <ul class="space-y-2 mt-4">
          <li
            class="mb-4 rounded-md py-1 px-2"
            v-for="chat in filteredChats"
            :key="chat.id"
            :class="{
              'bg-gray-100': $route.params.id === chat.id,
            }"
          >
            <NuxtLink
              :to="`/${chat.id}`"
              :class="{
                'text-sky-400': $route.params.id === chat.id,
                'hover:text-sky-400': $route.params.id !== chat.id,
              }"
              class="flex flex-row gap-3 py-1 transition-colors items-center relative"
            >
              <div class="relative">
                <img
                  :src="chat.user.avatar"
                  :alt="chat.user.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <span
                  :class="{
                    'bg-green-500': chat.user.isOnline,
                    'bg-red-500': !chat.user.isOnline,
                  }"
                  class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                ></span>
              </div>

              <div class="flex flex-col justify-center gap-1 flex-1 min-w-0">
                <p class="text-sm truncate">{{ chat.user.name }}</p>
                <p class="text-xs text-gray-500 truncate">
                  {{ getLastMessagePreview(chat.messages) }}
                </p>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="col-span-3 overflow-y-auto">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from "@/stores/chatStore";
import { ref, computed } from "vue";

const searchQuery = ref("");
const chatStore = useChatStore();
await chatStore.fetchChats();

const filteredChats = computed(() => {
  if (!searchQuery.value) return chatStore.chats;
  return chatStore.chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const getLastMessagePreview = (messages) => {
  if (!messages?.length) return "No messages yet";
  const lastMsg = messages[messages.length - 1];
  return lastMsg.content.length > 25
    ? `${lastMsg.content.substring(0, 25)}...`
    : lastMsg.content;
};
</script>
