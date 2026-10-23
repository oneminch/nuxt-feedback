<script lang="ts" setup>
import { useRoute, ref, createError } from "#imports";
import { Button } from "#nuxt-feedback/components/ui/button";
import { Label } from "#nuxt-feedback/components/ui/label";
import { Textarea } from "#nuxt-feedback/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#nuxt-feedback/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#nuxt-feedback/components/ui/tooltip";
import {
  RadioGroup,
  RadioGroupItem,
} from "#nuxt-feedback/components/ui/radio-group";
import FormValidationMessage from "#nuxt-feedback/components/FormValidationMessage.vue";
import type { FeedbackUIProps, FeedbackFormState } from "../types";
import Emoji from "#nuxt-feedback/components/icons/Emoji.vue";
import { createFormData, defaultReactions } from "#nuxt-feedback/utils";

const formProps =
  defineProps<Pick<FeedbackUIProps, "submitLabel" | "withTopics" | "topics">>();

const formEmits = defineEmits<{
  (e: "after-submit", status: "success" | "failure", message: string): void;
}>();

const route = useRoute();

const formState = ref<FeedbackFormState>({
  topic: "",
  reaction: "",
  message: "",
});
const errors = ref<Partial<FeedbackFormState>>({});
const isSubmitting = ref(false);

const resetErrors = () => (errors.value = {});

const validate = () => {
  errors.value = {};

  if (formProps.withTopics && !formState.value.topic.trim()) {
    errors.value.topic = "Please select a topic.";
  }

  if (!formState.value.reaction.trim()) {
    errors.value.reaction = "Please select an option.";
  }

  return Object.keys(errors.value).length === 0;
};

const submitFeedback = async () => {
  if (!validate()) return;

  const feedbackData = createFormData(route, formState.value);

  isSubmitting.value = true;

  try {
    const res = await $fetch("/api/submit-feedback", {
      method: "POST",
      body: feedbackData,
    });

    if (res.error) {
      throw createError(res.message);
    }

    // Emit success event with message
    formEmits("after-submit", "success", res.message);
  } catch (error) {
    // Emit failure event with error message
    formEmits(
      "after-submit",
      "failure",
      error instanceof Error
        ? error.message
        : "Unknown error. Please try again later."
    );
  } finally {
    // Reset form state after submission
    formState.value.reaction = "";
    formState.value.message = "";
    formState.value.topic = "";

    // Reset errors
    resetErrors();

    // Reset submitting state
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="submitFeedback" @change="resetErrors">
    <Select v-if="withTopics" v-model="formState.topic">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select a topic" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="topic in topics" :key="topic" :value="topic">
            {{ topic }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <FormValidationMessage v-if="withTopics" :error-message="errors.topic" />

    <TooltipProvider>
      <RadioGroup
        v-model="formState.reaction"
        class="flex items-center justify-evenly gap-4 border border-border bg-muted/50 dark:bg-transparent p-4 rounded-md"
        name="Feedback Reaction"
      >
        <Tooltip v-for="[id, value] in defaultReactions" :key="id">
          <TooltipTrigger as-child>
            <RadioGroupItem
              class="aria-checked:border-radio-checked-border aria-checked:bg-radio-checked-background dark:aria-checked:bg-radio-checked-background"
              :value="value"
              :aria-label="value"
            >
              <span class="-z-0">
                <Emoji :type="id" />
              </span>
            </RadioGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ value }}</p>
          </TooltipContent>
        </Tooltip>
      </RadioGroup>
    </TooltipProvider>

    <FormValidationMessage :error-message="errors.reaction" />

    <div class="mb-5">
      <Label class="mb-1.5 text-base font-semibold" for="message"
        >Message (Optional)</Label
      >
      <Textarea
        id="message"
        v-model="formState.message"
        class="h-24 resize-y max-h-48"
        name="message"
        placeholder="Optional Message..."
      />
    </div>

    <Button
      class="w-full"
      :disabled="isSubmitting"
      :aria-disabled="isSubmitting"
    >
      {{ isSubmitting ? "Submitting..." : submitLabel }}
    </Button>
  </form>
</template>
