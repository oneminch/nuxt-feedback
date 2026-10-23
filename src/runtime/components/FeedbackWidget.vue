<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#nuxt-feedback/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "#nuxt-feedback/components/ui/drawer";
import { Button } from "#nuxt-feedback/components/ui/button";
import { cn } from "cn";
import { computed, onMounted, onUnmounted, ref, watch } from "#imports";
import type { FeedbackUIProps, SubmissionStatus } from "../types";
import FeedbackForm from "#nuxt-feedback/components/FeedbackForm.vue";
import FeedbackStatus from "#nuxt-feedback/components/FeedbackStatus.vue";
import useFeedbackWidget from "#nuxt-feedback/composables/useFeedbackWidget";
import { providePortalTarget } from "#nuxt-feedback/composables/usePortalTarget";
import { useMediaQuery } from "@vueuse/core";

withDefaults(defineProps<FeedbackUIProps>(), {
  title: "Feedback",
  description: "Tell us what you think.",
  triggerLabel: "Share Feedback",
  triggerClass: "",
  submitLabel: "Submit",
  withTopics: true,
  topics: () => ["General Feedback", "Bug Report", "Feature Request"],
});

providePortalTarget();

const { isOpen, registerWidget, unregisterWidget } = useFeedbackWidget();
const isDesktop = useMediaQuery("(min-width: 640px)");

const isFeedbackSubmitted = ref(false);
const submissionStatus = ref({
  status: "" as SubmissionStatus,
  message: "",
});

const handleAfterSubmit = (status: "success" | "failure", message: string) => {
  isFeedbackSubmitted.value = true;
  submissionStatus.value = { status, message };
};

const Modal = computed(() => ({
  Root: isDesktop.value ? Dialog : Drawer,
  Trigger: isDesktop.value ? DialogTrigger : DrawerTrigger,
  Content: isDesktop.value ? DialogContent : DrawerContent,
  Header: isDesktop.value ? DialogHeader : DrawerHeader,
  Title: isDesktop.value ? DialogTitle : DrawerTitle,
  Description: isDesktop.value ? DialogDescription : DrawerDescription,
}));

watch(isOpen, (newValue: boolean) => {
  if (!newValue) {
    isFeedbackSubmitted.value = false;
    submissionStatus.value = { status: "" as SubmissionStatus, message: "" };
  }
});

onMounted(() => {
  registerWidget();
});

onUnmounted(() => {
  unregisterWidget();
});
</script>

<template>
  <component :is="Modal.Root" v-model:open="isOpen">
    <component :is="Modal.Trigger" as-child>
      <Button
        part="trigger"
        :class="
          cn(
            'bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 shadow-none',
            triggerClass,
          )
        "
      >
        {{ triggerLabel }}
      </Button>
    </component>
    <component
      :is="Modal.Content"
      class="sm:max-w-sm px-2 *:px-4 text-zinc-900 dark:text-zinc-50"
    >
      <template v-if="!isFeedbackSubmitted">
        <component :is="Modal.Header">
          <component :is="Modal.Title">{{ title }}</component>
          <component :is="Modal.Description">
            {{ description }}
          </component>
        </component>

        <FeedbackForm
          :submit-label="submitLabel"
          :with-topics="withTopics"
          :topics="topics"
          @after-submit="handleAfterSubmit"
        />
      </template>

      <template v-else>
        <FeedbackStatus
          v-if="isFeedbackSubmitted"
          :status="submissionStatus.status"
          :message="submissionStatus.message"
        />
      </template>

      <DrawerFooter v-if="!isDesktop" class="pt-2">
        <DrawerClose as-child>
          <Button variant="outline"> Close </Button>
        </DrawerClose>
      </DrawerFooter>
    </component>
  </component>
</template>
