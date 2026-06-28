<script setup>
import { inject, computed } from 'vue';

// Tangkap kamus bahasa dari App.vue
const lang = inject('lang');

// Definisikan props dasar yang aman
const props = defineProps({
  show: Boolean,
  title: { type: String, default: '' },
  message: String,
  type: { type: String, default: 'info' },
  confirmText: { type: String, default: '' }
});

defineEmits(['close', 'confirm']);

// 1. Computed Title
const displayTitle = computed(() => {
  if (props.title) return props.title;
  return lang?.value?.alertSaveTitle || 'Pemberitahuan';
});

// 2. CORRECTION BUG: Computed Confirm Text (Tombol Aksi Kanan)
const displayConfirmText = computed(() => {
  // Jika dari halaman dikirim properti custom text, pakai itu dulu
  if (props.confirmText) return props.confirmText;

  const titleLower = displayTitle.value.toLowerCase();

  // Cek apakah konteksnya adalah aksi penghapusan / pemutusan hubungan
  if (titleLower.includes('hapus') || titleLower.includes('delete') || titleLower.includes('remove')) {
    return lang?.value?.btnDelete || 'Delete';
  }
  if (titleLower.includes('putuskan') || titleLower.includes('disconnect')) {
    return lang?.value?.btnDisconnect ? lang.value.btnDisconnect.split(' ')[0] : 'Disconnect';
  }
  if (titleLower.includes('buka') || titleLower.includes('unblock')) {
    return lang?.value?.btnUnblock || 'Unblock';
  }

  // Fallback standar jika alert info biasa
  return 'OK';
});

// 3. Computed Cancel Text (Tombol Batal Kiri)
const displayCancelText = computed(() => {
  if (lang?.value?.btnCancelPairing) {
    // Potong teks agar hanya menyisakan kata "Batal" atau "Cancel" murni
    return lang.value.btnCancelPairing.replace('Penautan', '').replace('Pairing', '').trim();
  }
  return 'Cancel';
});
</script>

<template>
  <Transition name="ios-alert">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-6 select-none">
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-[270px] bg-white/90 backdrop-blur-xl rounded-[14px] shadow-2xl overflow-hidden border border-white/20 flex flex-col items-center text-center pt-5">
        
        <div v-if="type === 'error'" class="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mb-2">!</div>
        <div v-if="type === 'success'" class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mb-2">✓</div>
        <div v-if="type === 'confirm'" class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mb-2">?</div>

        <div class="px-4 pb-4 space-y-1">
          <!-- Gunakan variabel computed baru hasil inject -->
          <h4 class="text-[17px] font-semibold text-zinc-950 tracking-tight leading-tight">{{ displayTitle }}</h4>
          <p class="text-[13px] text-zinc-600 leading-snug">{{ message }}</p>
        </div>

        <!-- MODE 1: SATU TOMBOL (INFO / ERROR / SUCCESS) -->
        <button 
          v-if="type !== 'confirm'"
          @click="$emit('close')" 
          class="w-full py-3 border-t border-zinc-300/50 text-[17px] font-semibold text-blue-600 hover:bg-zinc-200/50 active:bg-zinc-300/60 transition duration-100 outline-none"
        >
          OK
        </button>

        <!-- MODE 2: DUA TOMBOL SEJAJAR Khas iOS (CONFIRMATION) -->
        <div v-else class="w-full grid grid-cols-2 border-t border-zinc-300/50 divide-x divide-zinc-300/50 text-[17px]">
          <button 
            @click="$emit('close')" 
            class="py-3 font-normal text-zinc-500 hover:bg-zinc-200/50 active:bg-zinc-300/60 transition duration-100 outline-none"
          >
            <!-- Teks tombol cancel otomatis multibahasa -->
            {{ displayCancelText }}
          </button>
          <button 
            @click="$emit('confirm')" 
            :class="['py-3 font-semibold hover:bg-zinc-200/50 active:bg-zinc-300/60 transition duration-100 outline-none', 
              displayTitle.includes('Hapus') || displayTitle.includes('Putuskan') || displayTitle.includes('Delete') || displayTitle.includes('Disconnect') ? 'text-red-600' : 'text-blue-600']"
          >
            <!-- Teks tombol confirm otomatis multibahasa -->
            {{ displayConfirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.ios-alert-enter-active { transition: opacity 0.25s ease-out; }
.ios-alert-enter-active .relative { transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.ios-alert-leave-active { transition: opacity 0.15s ease-in; }
.ios-alert-leave-active .relative { transition: transform 0.15s ease-in; }
.ios-alert-enter-from { opacity: 0; }
.ios-alert-enter-from .relative { transform: scale(1.15); }
.ios-alert-leave-to { opacity: 0; }
.ios-alert-leave-to .relative { transform: scale(1); }
</style>