<script setup>
import { ref, inject } from 'vue';
import LogTerminal from '../components/LogTerminal.vue';
import AutoreplyTable from '../components/AutoreplyTable.vue';
import CerdasSettings from '../components/CerdasSettings.vue';
import AlertiOS from '../components/AlertiOS.vue';

const emit = defineEmits(['trigger-disconnect']);

// Menangkap Kamus Bahasa Aktif dari App.vue
const lang = inject('lang');

const deviceInfo = ref({ nomor_hp: '6281296653845', nama_profil: 'Amanda (Customer Service)' });
const logs = ref([
  '[RECEIVE] Pesan masuk dari 628771234xx: "lokasi kantor dimana ya?"',
  '[REPLY] Membalas 628771234xx: "Kantor kami beralamat di..." (Keyword Match)',
  '[SUCCESS] Bot Aktif! Terhubung sebagai Amanda (Customer Service)'
]);
const autoreplies = ref([
  { id: 1, keyword: 'alamat', reply: 'Kantor kami beralamat di Jl. Merdeka No. 45, Jakarta Pusat.' }
]);
const blacklist = ref([
  { id: 1, nomor_hp: '62899999999', keterangan: 'Nomor Spam Penawaran' }
]);
const settings = ref({ fallback_message: 'Mohon tunggu sebentar...', reply_only_contacts: true });

const alertShow = ref(false);
const alertTitle = ref('');
const alertMessage = ref('');
const alertType = ref('info');
const currentAction = ref(null);

const bukaAlertKonfirmasi = (title, message, callback) => {
  alertTitle.value = title;
  alertMessage.value = message;
  alertType.value = 'confirm';
  currentAction.value = callback;
  alertShow.value = true;
};

// Penggunaan Teks Kamus Dinamis pada Dialog Konfirmasi
const pemicuPutusPerangkat = () => {
  bukaAlertKonfirmasi(lang.value.confirmDisconnectTitle, lang.value.confirmDisconnectDesc, () => { emit('trigger-disconnect'); });
};

const pemicuHapusReply = (item) => {
  bukaAlertKonfirmasi(lang.value.confirmDeleteTitle, lang.value.confirmDeleteDesc, () => { autoreplies.value = autoreplies.value.filter(r => r.id !== item.id); });
};

const pemicuBukaBlokir = (id) => {
  bukaAlertKonfirmasi(lang.value.confirmUnblockTitle, lang.value.confirmUnblockDesc, () => { blacklist.value = blacklist.value.filter(b => b.id !== id); });
};

const handleAddReply = (payload) => { autoreplies.value.unshift({ id: Date.now(), ...payload }); };
const handleAddBlacklist = (payload) => { blacklist.value.unshift({ id: Date.now(), ...payload }); };
const handleUpdateSettings = (payload) => {
  settings.value = payload;
  alertTitle.value = lang.value.alertSaveTitle;
  alertMessage.value = lang.value.alertSaveDesc;
  alertType.value = 'success';
  alertShow.value = true;
  currentAction.value = null;
};

const eksekusiAksiKonfirmasi = () => {
  alertShow.value = false;
  if (currentAction.value) currentAction.value();
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-zinc-200 gap-4">
      <div>
        <h2 class="text-2xl font-extrabold text-zinc-900 tracking-tight">{{ lang.navTitle }}</h2>
        <p class="text-xs text-zinc-400 mt-0.5">{{ lang.navSub }} <span class="text-zinc-700 font-bold">{{ deviceInfo.nama_profil }}</span></p>
      </div>
      <button @click="pemicuPutusPerangkat" class="py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-xs transition">
        {{ lang.btnDisconnect }}
      </button>
    </div>

    <div class="grid lg:grid-cols-12 gap-8">
      <div class="lg:col-span-4">
        <LogTerminal :logs="logs" />
      </div>

      <div class="lg:col-span-8 space-y-8">
        <AutoreplyTable 
          :autoreplies="autoreplies" 
          @add-reply="handleAddReply" 
          @trigger-delete-confirm="pemicuHapusReply" 
        />
        <CerdasSettings 
          :settings="settings" 
          :blacklist="blacklist" 
          @update-settings="handleUpdateSettings" 
          @add-blacklist="handleAddBlacklist" 
          @trigger-unblock-confirm="pemicuBukaBlokir" 
        />
      </div>
    </div>

    <AlertiOS :show="alertShow" :title="alertTitle" :message="alertMessage" :type="alertType" @close="alertShow = false" @confirm="eksekusiAksiKonfirmasi" />
  </div>
</template>