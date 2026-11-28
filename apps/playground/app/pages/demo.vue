<script setup lang="ts">
const { openWidget } = useFeedbackWidget();
</script>

<template>
  <div class="demo-content">
    <div>
      <span class="demo-type">Using Composable</span>

      <button class="btn btn--secondary" @click="openWidget">
        Feedback
        <span>💬</span>
      </button>
    </div>

    <div>
      <span class="demo-type">With Custom Toics</span>

      <FeedbackWidget
        aria-label="Share Feedback"
        trigger-label="Share Feedback 💬"
        trigger-class="trigger"
        :topics="['Account', 'Billing', 'Profile', 'Notifications']"
      />
    </div>

    <div>
      <span class="demo-type">Without Toics</span>

      <FeedbackWidget
        aria-label="Help Us Improve"
        trigger-label="Help Us Improve 💚"
        trigger-class="trigger trigger-3"
        :with-topics="false"
      />
    </div>

    <div>
      <span class="demo-type">With Custom Label</span>

      <FeedbackWidget
        aria-label="Was this helpful?"
        trigger-label="Was this helpful?"
        trigger-class="trigger trigger-4"
      />
    </div>
  </div>
</template>

<style scoped>
.demo-content {
  background-color: #fff;
  border: 0.5px solid #ddd;
  border-radius: 1rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(100px, 1fr));
  grid-template-rows: repeat(2, minmax(250px, 1fr));
  gap: 0px;
}

.demo-content > div {
  border: 0.5px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.demo-content > div > .demo-type {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem 1rem;
  border: 1px solid #ddd;
  border-top: 0;
  border-right: 0;
  display: block;
  text-align: center;
  color: #888;
  font-size: 0.75rem;
}

.demo-content > div > .demo-type::before {
  content: "";
  display: block;
  border: 1px solid #ddd;
  border-top: 0;
  border-right: 0;
  position: absolute;
  bottom: -5px;
  left: -5px;
  width: 7.5px;
  height: 7.5px;
}

.demo-content > div:first-of-type {
  border-top-left-radius: 1rem;
}

.demo-content > div:nth-of-type(2) {
  border-top-right-radius: 1rem;
}

.demo-content > div:nth-of-type(3) {
  border-bottom-left-radius: 1rem;
}

.demo-content > div:last-of-type {
  border-bottom-right-radius: 1rem;
}

.trigger {
  box-shadow: none;
}

.trigger-3 {
  border-radius: 5rem;
}

.trigger-4 {
  border-radius: 0;
}

@media (max-width: 480px) {
  .demo-content {
    grid-template-columns: repeat(1, minmax(100px, 1fr));
    grid-template-rows: repeat(4, minmax(250px, 1fr));
  }

  .demo-content > div:first-of-type {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
  }

  .demo-content > div:nth-of-type(2) {
    border-radius: 0;
  }

  .demo-content > div:nth-of-type(3) {
    border-radius: 0;
  }

  .demo-content > div:last-of-type {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }
}
</style>
