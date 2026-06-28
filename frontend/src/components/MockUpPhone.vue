<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// State Kontrol Alur Chat Animasi
const showSenderTyping = ref(false);
const showSenderMessage = ref(false);
const showBotTyping = ref(false);
const showBotMessage = ref(false);

let timers = [];

const jalankanAnimasiObrolan = () => {
  // Reset semua state ke awal
  showSenderTyping.value = false;
  showSenderMessage.value = false;
  showBotTyping.value = false;
  showBotMessage.value = false;

  // Gerbang 1: Detik 1 -> Kustomer Mulai Mengetik
  timers.push(setTimeout(() => { showSenderTyping.value = true; }, 1000));

  // Gerbang 2: Detik 3 -> Teks Kustomer Masuk, Indikator Mengetik Hilang
  timers.push(setTimeout(() => {
    showSenderTyping.value = false;
    showSenderMessage.value = true;
  }, 3000));

  // Gerbang 3: Detik 5.5 -> Bot Mendeteksi & Mulai Mengetik Balasan
  timers.push(setTimeout(() => { showBotTyping.value = true; }, 5500));

  // Gerbang 4: Detik 8 -> Balasan Bot Masuk, Indikator Bot Hilang
  timers.push(setTimeout(() => {
    showBotTyping.value = false;
    showBotMessage.value = true;
  }, 8000));

  // Gerbang 5: Detik 14 -> Loop Berulang (Reset Total)
  timers.push(setTimeout(() => {
    jalankanAnimasiObrolan();
  }, 14000));
};

onMounted(() => {
  jalankanAnimasiObrolan();
});

onBeforeUnmount(() => {
  // Bersihkan semua timer jika komponen tidak dirender agar tidak memakan memori browser
  timers.forEach(clearTimeout);
});
</script>

<template>
  <div class="w-72 h-[520px] bg-black rounded-[40px] p-3 shadow-2xl border-4 border-zinc-800 relative ring-1 ring-zinc-700 select-none">
    <div class="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20"></div>
    
    <div class="w-full h-full bg-zinc-900 rounded-[32px] overflow-hidden flex flex-col justify-between p-4 relative pt-8">
      <div class="flex items-center space-x-2 pb-2 border-b border-zinc-800/60">
        <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">S</div>
        <div>
          <p class="text-[11px] font-semibold text-zinc-200">628XXXX-XXXX-XXXX</p>
          <p class="text-[9px] text-emerald-400">online</p>
        </div>
      </div>

      <div class="flex-1 py-4 flex flex-col justify-end space-y-3 overflow-hidden text-[11px]">
        
        <div v-if="showSenderMessage" class="bg-zinc-800 text-zinc-200 p-2.5 rounded-2xl rounded-tl-none max-w-[85%] self-start shadow-sm animate-slide-up">
          Halo, Permisi mau tanya alamat kantornya dimana ya om?
        </div>

        <div v-if="showSenderTyping" class="bg-zinc-800/40 text-zinc-400 py-1.5 px-3 rounded-full max-w-max self-start italic text-[10px] flex items-center space-x-1">
          <span class="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-75"></span>
          <span>sedang mengetik...</span>
        </div>

        <div v-if="showBotMessage" class="bg-emerald-700 text-white p-2.5 rounded-2xl rounded-tr-none max-w-[85%] self-end shadow-md animate-slide-up">
          Halo !. Kantor kami beralamat di Jl. Merdeka No. 45, Jakarta Pusat. Ada lagi yang bisa dibantu?
        </div>

        <div v-if="showBotTyping" class="bg-emerald-900/30 text-emerald-400 py-1.5 px-3 rounded-full max-w-max self-end italic text-[10px] flex items-center space-x-1">
          <span>bot is typing...</span>
          <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>