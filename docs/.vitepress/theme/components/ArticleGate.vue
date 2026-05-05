<template>
  <div class="article-gate" :class="{ 'is-locked': !isUnlocked }">
    <!-- 预览内容 -->
    <div v-if="preview" class="preview-content" v-html="preview"></div>

    <!-- 锁定状态 -->
    <div v-if="!isUnlocked" class="gate-ui">
      <h3>📕 继续阅读需要验证</h3>
      <p>
        关注公众号 <strong>阿Duang的测开笔记</strong><br>
        回复关键词 <code>口令</code> 获取访问口令
      </p>

      <div v-if="config.qrCode" class="qr-container">
        <img :src="config.qrCode" :alt="config.siteName" class="qr-code">
      </div>

      <form @submit.prevent="verifyPasscode" class="passcode-form">
        <input
          v-model="inputCode"
          type="password"
          placeholder="请输入口令"
          class="passcode-input"
          maxlength="20"
        >
        <button type="submit" class="submit-btn">解锁</button>
      </form>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>

    <!-- 解锁后的完整内容 -->
    <div v-if="isUnlocked" class="full-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gateConfig from '../gateConfig.js'

const isUnlocked = ref(false)
const inputCode = ref('')
const error = ref('')
const preview = ref('')
const config = gateConfig
const STORAGE_KEY = 'weduang-passcode'

function decodePass() {
  try {
    return atob(gateConfig.passcodeEncoded)
  } catch {
    return ''
  }
}

const verifyPasscode = () => {
  error.value = ''

  if (inputCode.value.length < 4) {
    error.value = '口令太短了'
    return
  }

  if (inputCode.value === decodePass()) {
    isUnlocked.value = true
    localStorage.setItem(STORAGE_KEY, inputCode.value)
  } else {
    error.value = '口令错误，请检查后重试'
  }
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && saved === decodePass()) {
    isUnlocked.value = true
  }
})
</script>

<style scoped>
.article-gate {
  position: relative;
}

.preview-content {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px dashed var(--vp-c-divider);
}

.gate-ui {
  padding: 2rem;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 12px;
  text-align: center;
  background: var(--vp-c-bg-soft);
}

.gate-ui h3 {
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
}

.gate-ui p {
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

.gate-ui code {
  background: var(--vp-c-bg);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: var(--vp-c-brand-1);
}

.qr-container {
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
}

.qr-code {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  padding: 0.5rem;
  background: white;
}

.passcode-form {
  display: flex;
  gap: 0.5rem;
  max-width: 300px;
  margin: 0 auto 1rem;
}

.passcode-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.submit-btn:hover {
  background: var(--vp-c-brand-2);
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.full-content {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>