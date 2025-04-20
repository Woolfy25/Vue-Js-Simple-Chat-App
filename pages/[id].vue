<template>
  <div class="grid grid-rows-[auto_1fr_auto] h-full">
    <div
      class="px-6 py-4 border-b-2 border-gray-300 flex items-center justify-between"
    >
      <div class="flex flex-row items-center gap-4">
        <img
          :src="chat.user.avatar"
          :alt="chat.user.name"
          class="w-11 h-11 rounded-full object-cover"
        />
        <div>
          <h2 class="text-lg font-semibold">{{ chat.user.name }}</h2>
          <p
            class="text-xs"
            :class="{
              'text-green-500': chat.user.isOnline,
              'text-gray-500': !chat.user.isOnline,
            }"
          >
            {{ chat.user.isOnline ? "Online" : "Offline" }}
          </p>
        </div>
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="5" cy="12" r="1"></circle>
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
        </svg>
      </div>
    </div>
    <div ref="messagesContainer" class="overflow-y-auto p-5">
      <div v-for="msg in chat.messages" :key="msg.id" class="mb-4">
        <div v-if="msg.isInbox" class="flex items-start gap-2">
          <img
            :src="chat.user.avatar"
            :alt="chat.user.name"
            class="w-8 h-8 rounded-full object-cover mt-5"
          />
          <div class="max-w-[70%]">
            <div class="flex items-baseline gap-2 mb-1">
              <p class="text-xs font-medium text-gray-600">
                {{ chat.user.name }}
              </p>
              <p class="text-xs text-gray-400">
                {{ formatTime(msg.sentAt) }}
              </p>
            </div>
            <div class="bg-gray-100 py-2 px-3 rounded-xl rounded-tl-none">
              <p class="text-gray-800">{{ msg.content }}</p>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-end">
          <div class="max-w-[70%] flex flex-col">
            <div
              class="bg-sky-400 py-2 px-3 rounded-xl rounded-br-none text-white"
            >
              <p>{{ msg.content }}</p>
            </div>
            <p class="text-xs text-gray-500 mt-1 self-end">
              {{ formatTime(msg.sentAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="p-5 border-t-2 border-gray-300">
      <div class="flex gap-2 items-center">
        <div class="relative flex-grow">
          <input
            v-model="newMsg"
            placeholder="Type something here..."
            class="w-full p-2 pr-16 border border-gray-300 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
            @keyup.enter="sendMsg"
          />
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1"
          >
            <button type="button" class="text-gray-400 hover:text-gray-600 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
            <button type="button" class="text-gray-400 hover:text-gray-600 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
        <button
          @click="sendMsg"
          class="p-2 bg-sky-400 text-white rounded-sm hover:bg-sky-500"
          title="Send"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useChatStore } from "@/stores/chatStore";
import { computed, ref, watch, nextTick } from "vue";

const chatStore = useChatStore();
await chatStore.fetchChats();

const route = useRoute();
const chatId = route.params.id;

const chat = computed(() => chatStore.chats.find((c) => c.id === chatId));
const newMsg = ref("");
const messagesContainer = ref(null);

watch(() => chat.value?.messages, async () => {
  await nextTick();
  scrollToBottom();
}, { deep: true });

onMounted(() => {
  scrollToBottom();
});

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function sendMsg() {
  if (!newMsg.value.trim()) return;
  chatStore.sendMessage(chatId, newMsg.value);
  newMsg.value = "";
}

const formatTime = (timestamp) => {
  if (!timestamp) return "";

  try {
    const normalizedTimestamp = timestamp.replace(
      /T(\d{2}):(\d{2}):(\d{2})/,
      (_, hh, mm, ss) => {
        const validSS = Math.min(59, parseInt(ss));
        return `T${hh}:${mm}:${validSS.toString().padStart(2, "0")}`;
      }
    );

    const date = new Date(normalizedTimestamp);
    return isNaN(date)
      ? ""
      : date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
  } catch {
    return "";
  }
};
</script>
