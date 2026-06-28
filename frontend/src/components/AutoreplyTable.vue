<script setup>
import { ref, inject } from 'vue';

defineProps({ autoreplies: Array });
const emit = defineEmits(['add-reply', 'trigger-delete-confirm']);

// Suntik Kamus Bahasa
const lang = inject('lang');

const keyword = ref('');
const reply = ref('');
const keywordError = ref(false);
const replyError = ref(false);

const checkAndSubmit = () => {
  keywordError.value = false; replyError.value = false;
  if (!keyword.value.trim()) keywordError.value = true;
  if (!reply.value.trim()) replyError.value = true;
  if (keywordError.value || replyError.value) return;

  emit('add-reply', { keyword: keyword.value, reply: reply.value });
  keyword.value = ''; reply.value = '';
};
</script>

<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200/80 space-y-6">
    <h3 class="font-bold text-sm tracking-wide text-zinc-400 uppercase">{{ lang.keywordTitle }}</h3>
    
    <div class="grid sm:grid-cols-12 gap-4 items-end bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
      <div class="sm:col-span-4 space-y-1.5">
        <label class="text-[11px] font-bold text-zinc-500 uppercase">{{ lang.labelKey }}</label>
        <input v-model="keyword" type="text" :placeholder="lang.placeholderKey" :class="['w-full px-3 py-2 bg-white border rounded-xl text-xs focus:outline-none shadow-sm transition-all', keywordError ? 'border-red-400 bg-red-50/50' : 'border-zinc-200 focus:border-blue-500']" />
      </div>
      <div class="sm:col-span-6 space-y-1.5">
        <label class="text-[11px] font-bold text-zinc-500 uppercase">{{ lang.labelReply }}</label>
        <input v-model="reply" type="text" :placeholder="lang.placeholderReply" :class="['w-full px-3 py-2 bg-white border rounded-xl text-xs focus:outline-none shadow-sm transition-all', replyError ? 'border-red-400 bg-red-50/50' : 'border-zinc-200 focus:border-blue-500']" />
      </div>
      <div class="sm:col-span-2">
        <button @click="checkAndSubmit" class="w-full py-2 px-3 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition">{{ lang.btnSubmit }}</button>
      </div>
    </div>

    <div class="overflow-hidden border border-zinc-100 rounded-2xl shadow-sm">
      <div class="bg-zinc-50 px-4 py-2 text-[11px] font-bold text-zinc-500 border-b border-zinc-100 grid grid-cols-12">
        <div class="col-span-3">{{ lang.thKey }}</div>
        <div class="col-span-8">{{ lang.thReply }}</div>
        <div class="col-span-1 text-right">{{ lang.thAction }}</div>
      </div>
      <div class="divide-y divide-zinc-100 bg-white text-xs">
        <div v-for="item in autoreplies" :key="item.id" class="px-4 py-3 grid grid-cols-12 items-center hover:bg-zinc-50 transition">
          <div class="col-span-3 font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md inline-block max-w-max truncate">{{ item.keyword }}</div>
          <div class="col-span-8 text-zinc-600 pr-4 truncate">{{ item.reply }}</div>
          <div class="col-span-1 text-right">
            <button @click="$emit('trigger-delete-confirm', item)" class="text-red-500 hover:text-red-700 font-medium text-[11px]">{{ lang.btnDelete }}</button>
          </div>
        </div>
        <div v-if="autoreplies.length === 0" class="px-4 py-4 text-center text-zinc-400 italic">{{ lang.tableEmpty }}</div>
      </div>
    </div>
  </div>
</template>