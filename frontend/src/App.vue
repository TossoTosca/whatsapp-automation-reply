<script setup>
import { ref, provide, computed } from 'vue';
import MockupPhone from './components/MockupPhone.vue';
import MainDashboard from './views/MainDashboard.vue';
import AlertiOS from './components/AlertiOS.vue';
import { translations } from './locales/index.js';

const currentLang = ref('id');

const lang = computed(() => translations[currentLang.value]);
provide('lang', lang);

const isConnected = ref(false);
const botStatus = ref("DISCONNECTED");
const pairingCode = ref("");
const inputNomorHP = ref("");
const alertConfig = ref({ show: false, title: '', message: '', type: 'info' });

let simulasiTimeout = null;

const isNomorValid = (nomor) => {
  const nomorBersih = nomor.replace(/[^0-9]/g, '');
  if (nomorBersih.length < 9 || nomorBersih.length > 15) return false;
  if (/^(\d)\1{7,}$/.test(nomorBersih)) return false;
  return true;
};

const showAlert = (title, message, type = 'info') => {
  alertConfig.value = { show: true, title, message, type };
};

const simulasiStartBot = () => {
  if (!inputNomorHP.value || !isNomorValid(inputNomorHP.value)) {
    showAlert(lang.value.alertInvalidTitle, lang.value.alertInvalidDesc, "error");
    return;
  }
  
  botStatus.value = "CONNECTING";
  pairingCode.value = "";

  simulasiTimeout = setTimeout(() => {
    pairingCode.value = "74X9-L2PZ";
    simulasiTimeout = setTimeout(() => {
      botStatus.value = "READY";
      isConnected.value = true;
    }, 5000);
  }, 1500);
};

const simulasiCancelPairing = () => {
  if (simulasiTimeout) clearTimeout(simulasiTimeout);
  botStatus.value = "DISCONNECTED";
};

const simulasiDisconnect = () => {
  isConnected.value = false;
  botStatus.value = "DISCONNECTED";
  pairingCode.value = "";
  inputNomorHP.value = "";
  if (simulasiTimeout) clearTimeout(simulasiTimeout);
};

const resetFormTautan = () => {
  botStatus.value = "DISCONNECTED";
  pairingCode.value = "";
  inputNomorHP.value = "";
  if (simulasiTimeout) clearTimeout(simulasiTimeout);
};

const toggleLanguage = (locale) => {
  currentLang.value = locale;
};
</script>

<template>
  <div class="min-h-screen bg-zinc-100 text-zinc-900 font-sans antialiased overflow-x-hidden relative">
    
    <div class="absolute top-4 right-4 z-40 bg-zinc-200/80 backdrop-blur p-0.5 rounded-lg flex space-x-0.5 border border-zinc-300/30 shadow-sm select-none">
      <button 
        @click="toggleLanguage('id')" 
        :class="['px-3 py-1 text-[11px] font-semibold rounded-md transition duration-150', 
          currentLang === 'id' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800']"
      >
        ID
      </button>
      <button 
        @click="toggleLanguage('en')" 
        :class="['px-3 py-1 text-[11px] font-semibold rounded-md transition duration-150', 
          currentLang === 'en' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800']"
      >
        EN
      </button>
    </div>

    <Transition name="ios-page" mode="out-in">
      
      <div v-if="!isConnected" key="landing" class="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center min-h-screen">
        
        <div class="flex justify-center">
          <MockupPhone />
        </div>

        <div class="space-y-6">
          <div class="space-y-2">
            <span class="text-xs font-bold tracking-widest text-blue-600 uppercase">{{ lang.subtitle }}</span>
            <h1 class="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">{{ lang.title }}</h1>
            <p class="text-sm text-zinc-500">{{ lang.desc }}</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200/80 space-y-5">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-base text-zinc-800">{{ lang.cardTitle }}</h3>
              <span :class="['px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase', 
                botStatus === 'CONNECTING' ? 'bg-amber-100 text-amber-700 animate-pulse' : 
                (botStatus === 'DISCONNECTED' && pairingCode) ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-500']">
                {{ botStatus === 'DISCONNECTED' && pairingCode ? 'CANCELLED' : botStatus }}
              </span>
            </div>

            <div v-if="botStatus === 'DISCONNECTED' && !pairingCode" class="space-y-4 animate-fade-in">
              <div class="space-y-1.5">
                <label class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{{ lang.labelNumber }}</label>
                <input v-model="inputNomorHP" type="text" :placeholder="lang.placeholderNumber" class="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 shadow-sm" />
              </div>
              <button @click="simulasiStartBot" class="w-full py-2.5 px-4 bg-zinc-950 text-white font-semibold rounded-xl text-xs hover:bg-zinc-800 transition">
                {{ lang.btnStart }}
              </button>
            </div>

            <div v-if="botStatus === 'CONNECTING' && !pairingCode" class="py-6 flex flex-col items-center space-y-3">
              <div class="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-xs text-zinc-400 font-medium">{{ lang.loadingBrowser }}</p>
            </div>

            <div v-if="pairingCode && botStatus !== 'DISCONNECTED' && botStatus !== 'READY'" class="space-y-4 text-center animate-fade-in">
              <p class="text-xs font-medium text-zinc-500">{{ lang.pairingDesc }}</p>
              <div class="bg-zinc-50 border border-zinc-200 rounded-2xl py-3 px-6 tracking-widest text-3xl font-mono font-bold text-blue-600 shadow-inner inline-block mx-auto animate-pulse">
                {{ pairingCode }}
              </div>
              <button @click="simulasiCancelPairing" class="w-full py-2 px-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition">
                {{ lang.btnCancelPairing }}
              </button>
            </div>

            <div v-if="botStatus === 'DISCONNECTED' && pairingCode" class="space-y-4 text-center border-t border-zinc-100 pt-4 animate-fade-in">
              <div class="text-red-500 font-semibold text-xs flex items-center justify-center gap-1">
                {{ lang.cancelTitle }}
              </div>
              <p class="text-[11px] text-zinc-400">{{ lang.cancelDesc }}</p>
              <button @click="resetFormTautan" class="w-full py-2 px-3 bg-zinc-100 text-zinc-700 font-medium rounded-xl text-xs hover:bg-zinc-200 transition">
                {{ lang.btnBackForm }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else key="dashboard">
        <MainDashboard @trigger-disconnect="simulasiDisconnect" />
      </div>

    </Transition>

    <AlertiOS 
      :show="alertConfig.show" 
      :title="alertConfig.title" 
      :message="alertConfig.message" 
      :type="alertConfig.type" 
      @close="alertConfig.show = false" 
    />
  </div>
</template>

<style>
.ios-page-enter-active, .ios-page-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.ios-page-enter-from { opacity: 0; transform: translateX(60px) scale(0.97); }
.ios-page-leave-to { opacity: 0; transform: translateX(-60px) scale(1.03); }
.animate-fade-in { animation: fadeInState 0.3s ease-out forwards; }
@keyframes fadeInState { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>