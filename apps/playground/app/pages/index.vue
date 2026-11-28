<script setup lang="ts">
const { openWidget } = useFeedbackWidget();
</script>

<template>
  <div class="content">
    <img src="/logo.svg" alt="Widget Logo" class="" />

    <h2 class="">Help Us Improve By Sharing Your Feedback.</h2>

    <div class="buttons">
      <FeedbackWidget trigger-label="💬 Share Feedback" />
    </div>

    <FeedbackWidget
      aria-label="Share Feedback"
      trigger-label="💬"
      trigger-class="btn--icon btn--fixed"
      :with-topics="false"
    />
  </div>
</template>

<style scoped>
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
