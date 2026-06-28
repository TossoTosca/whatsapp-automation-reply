<script setup>
import { ref, inject } from 'vue';

const props = defineProps({ settings: Object, blacklist: Array });
const emit = defineEmits(['update-settings', 'add-blacklist', 'trigger-unblock-confirm']);

const lang = inject('lang');

const localSettings = ref({ ...props.settings });
const blacklistNumber = ref('');
const blacklistNote = ref('');

const triggerAddBlacklist = () => {
  if (!blacklistNumber.value) return;
  emit('add-blacklist', { nomor_hp: blacklistNumber.value, keterangan: blacklistNote.value });
  blacklistNumber.value = ''; blacklistNote.value = '';
};
</script>

<template>
  <div class="grid md:grid-cols-2 gap-8">
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200/80 space-y-6">
      <h3 class="font-bold text-sm tracking-wide text-zinc-400 uppercase">{{ lang.settingsTitle }}</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between py-2 border-b border-zinc-100">
          <div>
            <label class="text-xs font-bold text-zinc-800">{{ lang.toggleContact }}</label>
            <p class="text-[10px] text-zinc-400">{{ lang.toggleContactDesc }}</p>
          </div>
          <input v-model="localSettings.reply_only_contacts" type="checkbox" class="w-9 h-5 bg-zinc-200 checked:bg-emerald-500 rounded-full appearance-none cursor-pointer relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition duration-200 shadow-sm border border-zinc-300" />
        </div>
        <div class="space-y-1.5">
          <label class="text-[11px] font-bold text-zinc-500 uppercase">{{ lang.labelFallback }}</label>
          <textarea v-model="localSettings.fallback_message" rows="3" class="w-full p-3 border border-zinc-200 rounded-2xl text-xs focus:outline-none focus:border-blue-500 shadow-sm"></textarea>
        </div>
        <button @click="$emit('update-settings', localSettings)" class="w-full py-2.5 px-4 bg-zinc-900 text-white font-semibold rounded-xl text-xs shadow-sm hover:bg-zinc-800 transition">
          {{ lang.btnSaveSettings }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200/80 space-y-4">
      <h3 class="font-bold text-sm tracking-wide text-zinc-400 uppercase">{{ lang.blacklistTitle }}</h3>
      <div class="space-y-2 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
        <input v-model="blacklistNumber" type="text" :placeholder="lang.placeholderBl" class="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none" />
        <div class="flex gap-2">
          <input v-model="blacklistNote" type="text" :placeholder="lang.placeholderNote" class="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none" />
          <button @click="triggerAddBlacklist" class="bg-zinc-900 text-white px-3 py-1.5 text-xs font-semibold rounded-xl hover:bg-zinc-800 shadow-sm">{{ lang.btnBlock }}</button>
        </div>
      </div>
      <div class="max-h-40 overflow-y-auto border border-zinc-100 rounded-xl divide-y divide-zinc-100 text-xs">
        <div v-for="num in blacklist" :key="num.id" class="p-2.5 flex justify-between items-center bg-white hover:bg-zinc-50">
          <div>
            <p class="font-semibold text-zinc-900">{{ num.nomor_hp }}</p>
            <p class="text-[10px] text-zinc-400" v-if="num.keterangan">{{ num.keterangan }}</p>
          </div>
          <button @click="$emit('trigger-unblock-confirm', num.id)" class="text-red-500 hover:text-red-700 text-[10px]">{{ lang.btnUnblock }}</button>
        </div>
        <div v-if="blacklist.length === 0" class="p-4 text-center text-zinc-400 italic text-[11px]">{{ lang.blEmpty }}</div>
      </div>
    </div>
  </div>
</template>