<script setup>
import { ref, onMounted, onBeforeUnmount ,inject} from 'vue';

const props = defineProps({
  logs: Array // Menampung log awal dari parent
});

// Menyalin log dari props ke state lokal agar bisa kita manipulasi (ditambah otomatis)
const localLogs = ref([...props.logs]);

// Daftar bank data percakapan dummy untuk disimulasikan
const dummyConversations = [
  { nomor: '6281234567xx', keyword: 'jam buka', reply: 'Kami buka setiap hari Senin - Jumat pukul 09.00 - 17.00 WIB.' },
  { nomor: '628779988xx', keyword: 'alamat', reply: 'Kantor kami beralamat di Jl. Merdeka No. 45, Jakarta Pusat.' },
  { nomor: '628551122xx', keyword: 'harga', reply: 'Untuk daftar harga layanan, silakan ketik angka 1 untuk Brosur Digital.' },
  { nomor: '628190022xx', keyword: 'halo', reply: 'Halo, mohon tunggu sebentar. Pesan Anda akan dibalas oleh admin kami secepatnya.' } // Ini pemicu fallback
];

const lang = inject('lang');

let logInterval = null;

onMounted(() => {
  // Jalankan interval: Setiap 4 detik, simulasikan ada chat masuk dan balasan bot
  logInterval = setInterval(() => {
    // Pilih acak satu percakapan dari bank data
    const kustomerAcak = dummyConversations[Math.floor(Math.random() * dummyConversations.length)];
    
    // Format Waktu iOS Style (HH:MM:SS)
    const waktu = new Date().toLocaleTimeString('id-ID', { hour12: false });

    // Simulasi Langkah 1: Pesan Masuk Terdeteksi
    localLogs.value.unshift(`[${waktu}] [RECEIVE] Pesan masuk dari ${kustomerAcak.nomor}: "${kustomerAcak.keyword}"`);

    // Simulasi Langkah 2: Bot Membalas (Beri sedikit jeda 1.2 detik agar realistis)
    setTimeout(() => {
      const tipeBalasan = kustomerAcak.keyword === 'halo' ? 'FALLBACK' : 'REPLY';
      const pesanSistem = kustomerAcak.keyword === 'halo' 
        ? `[${waktu}] [FALLBACK] Membalas ${kustomerAcak.nomor}: "${kustomerAcak.reply}" (Default)`
        : `[${waktu}] [REPLY] Membalas ${kustomerAcak.nomor}: "${kustomerAcak.reply}" (Keyword Match)`;
      
      localLogs.value.unshift(pesanSistem);

      // Batasi panjang log agar tidak membebani browser (maksimal 40 baris)
      if (localLogs.value.length > 40) {
        localLogs.value.pop();
        localLogs.value.pop(); // Hapus sepasang log terlama di bawah
      }
    }, 1200);

  }, 5000); // Terjadi percakapan baru setiap 5 detik
});

onBeforeUnmount(() => {
  // Bersihkan interval jika user klik disconnect agar tidak bocor memorinya
  if (logInterval) clearInterval(logInterval);
});
</script>

<template>
  <div class="bg-white rounded-3xl p-5 shadow-sm border border-zinc-200/80 space-y-4 select-none">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-sm tracking-wide text-zinc-400 uppercase">{{ lang.logTitle }}</h3>
      <span class="flex h-2 w-2 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
    </div>

    <div class="bg-zinc-950 text-emerald-400 rounded-2xl p-4 font-mono text-[11px] shadow-inner h-[460px] overflow-y-auto space-y-2.5 border border-zinc-800 scrollbar-thin">
      
      <div v-for="(log, idx) in localLogs" :key="idx" 
        :class="['leading-relaxed break-words transition-all duration-300', 
          log.includes('[RECEIVE]') ? 'text-zinc-300' : 
          log.includes('[FALLBACK]') ? 'text-amber-400' : 'text-emerald-400']">
        {{ log }}
      </div>

      <div v-if="localLogs.length === 0" class="text-zinc-600 italic">Menunggu aktivitas pesan masuk...</div>
    </div>
  </div>
</template>

<style scoped>
/* Styling tambahan untuk memperhalus scrollbar terminal */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 10px;
}
</style>