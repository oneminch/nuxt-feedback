<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData("page-" + route.path, () => {
  return queryCollection("content").path(route.path).first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}
</script>

<template>
  <main v-if="page">
    <ContentRenderer
      :value="page"
      :data="{ toc: page.body?.toc?.links }"
      class="prose dark:prose-invert prose-neutral prose-a:decoration-1 prose-a:decoration-dashed prose-a:decoration-emerald-500 prose-code:leading-snug prose-code:font-normal prose-code:bg-neutral-800/85 prose-code:text-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:inline-block prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-pre:bg-neutral-800 prose-blockquote:*:first-of-type:before:content-none prose-blockquote:*:first-of-type:after:content-none"
    />
  </main>
</template>
