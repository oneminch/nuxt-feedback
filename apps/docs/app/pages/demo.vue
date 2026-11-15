<script setup lang="ts">
const { openWidget } = useFeedbackWidget();
</script>

<template>
  <div class="content">
    <img src="/logo.svg" alt="Widget Logo" class="" />

    <h2 class="">Help Us Improve By Sharing Your Feedback.</h2>

    <button class="btn btn--secondary" @click="openWidget">
      Share Feedback
      <span>💬</span>
    </button>

    <FeedbackWidget
      aria-label="Share Feedback"
      trigger-label="💬"
      trigger-class="btn--icon btn--fixed"
      :with-topics="false"
    />
  </div>
</template>

<style scoped>
.content {
  height: 75%;
  box-sizing: border-box;
  width: 100%;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.content * {
  text-align: center;
}

h2 {
  font-size: 1.75rem;
}

img {
  width: 8rem;
  height: 8rem;
  display: block;
  object-fit: contain;
  margin: 0 auto;
}
</style>
