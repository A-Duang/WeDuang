<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vitepress'
import gateConfig from './gateConfig.js'

const route = useRoute()
const unlocked = ref(false)
const input = ref('')
const error = ref('')
const STORAGE_KEY = 'weduang-passcode'

function decodePass() {
  if (typeof window === 'undefined') return ''
  try {
    return atob(gateConfig.passcodeEncoded)
  } catch {
    return ''
  }
}

function isPathGated(path) {
  if (gateConfig.indexPages.includes(path)) return false
  return gateConfig.gatedPrefixes.some(pre => path.startsWith(pre) && !path.endsWith('/'))
}

const isGated = computed(() => isPathGated(route.path))

function syncUnlock() {
  if (typeof window === 'undefined') return
  const saved = localStorage.getItem(STORAGE_KEY)
  unlocked.value = saved !== null && saved === decodePass()
}

function submit() {
  const val = input.value.trim()
  if (!val) {
    error.value = '请输入口令'
    return
  }
  if (val === decodePass()) {
    localStorage.setItem(STORAGE_KEY, val)
    unlocked.value = true
    error.value = ''
    input.value = ''
  } else {
    error.value = '口令不正确，请回公众号查看最新口令'
  }
}

onMounted(syncUnlock)
onBeforeRouteUpdate(syncUnlock)
</script>

<template>
  <Transition name="fade">
    <div v-if="isGated && !unlocked" class="gate-mask">
      <div class="gate-card">
        <h2>🔒 需要口令解锁</h2>
        <p class="gate-desc">
          关注微信公众号 <b>{{ gateConfig.siteName }}</b>，<br />
          回复关键词 <b>「{{ gateConfig.keyword }}」</b> 获取口令
        </p>
        <img
          v-if="gateConfig.qrCode"
          :src="gateConfig.qrCode"
          alt="公众号二维码"
          class="gate-qr"
        />
        <input
          v-model="input"
          type="text"
          placeholder="请输入口令"
          class="gate-input"
          @keydown.enter="submit"
        />
        <button class="gate-btn" @click="submit">解锁全部内容</button>
        <p v-if="error" class="gate-err">{{ error }}</p>
        <p class="gate-tip">解锁后本浏览器长期有效</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.gate-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.gate-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 32px 28px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3);
}
.gate-card h2 {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  border: 0;
  padding: 0;
}
.gate-desc {
  color: var(--vp-c-text-2);
  line-height: 1.7;
  font-size: 14px;
  margin: 8px 0 16px;
}
.gate-qr {
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin: 8px auto 16px;
  display: block;
  border-radius: 8px;
}
.gate-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 14px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}
.gate-input:focus {
  border-color: var(--vp-c-brand-1);
}
.gate-btn {
  width: 100%;
  padding: 11px 16px;
  margin-top: 10px;
  border: 0;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.gate-btn:hover {
  background: var(--vp-c-brand-2);
}
.gate-err {
  color: #e74c3c;
  margin: 10px 0 0;
  font-size: 13px;
}
.gate-tip {
  color: var(--vp-c-text-3);
  margin: 10px 0 0;
  font-size: 12px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
