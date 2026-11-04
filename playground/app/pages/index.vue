<script setup lang="ts">
const { openWidget } = useFeedbackWidget();
</script>

<template>
  <div class="content">
    <img src="/logo.svg" alt="Widget Logo" class="" />

    <h2 class="">Help Us Improve By Sharing Your Feedback.</h2>

    <div class="buttons">
      <FeedbackWidget
        trigger-label="💚 Share Feedback (Component)"
        trigger-class="btn"
      />

      <button class="btn" @click="openWidget">
        💚 Share Feedback (Composable)
      </button>
    </div>
  </div>
</template>

<style scoped>
.content * {
  text-align: center;
}

.content {
  height: 75%;
  box-sizing: border-box;
  width: 100%;
  padding: 3rem;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

h2 {
  font-size: 1.75rem;
}

.content .buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

img {
  width: 8rem;
  height: 8rem;
  display: block;
  object-fit: contain;
  margin: 0 auto;
}
</style>
