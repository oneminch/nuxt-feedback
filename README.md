![Cover Image](/playground/public/cover.png)

<div align="center">

# Nuxt Feedback Widget

[![npm version][npm-version-src]][npm-version-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

<!--
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![code quality][code-quality-src]][code-quality-href]
[![bundle size][bundle-size-src]][bundle-size-href]
-->

A simple & customizable feedback widget for your Nuxt apps.

[📖 Documentation](#table-of-contents) |
[💻 Demo](https://nuxt-feedback.minch.dev)

</div>

## Table of Contents

- [Features](#features)
- [Quick Setup](#quick-setup)
- [Configuration](#configuration)
  - [Module Options](#module-options)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Customizing the Widget](#customizing-the-widget)
  - [Using the Composable](#using-the-composable)
- [Submission Methods](#submission-methods)
  - [Email (Resend)](#email-resend)
  - [GitHub Issues](#github-issues)
  - [Custom Endpoint](#custom-endpoint)
- [Examples](#examples)
  - [Different Styling Approaches](#different-styling-approaches)
  - [Topic-specific Feedback](#topic-specific-feedback)
  - [Programmatic Control](#programmatic-control)
- [Known Issues](#known-issues)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Error Handling](#error-handling)
- [Contribution](#contribution)
- [License](#license)

## Features

- 💚 Beautiful & accessible UI based on Shadcn-Vue & Tailwind CSS 4
  - Built-in dark mode support with class (.dark)
- 🔩 Customizable `<FeedbackWidget />` component
- 📲 Scope feedback to specific features/topics
- 📧 Multiple submission methods supported:
  - Email (via Resend)
  - GitHub Issues
  - Custom Handler
- 🌟 Handy composable for controlling widget

I recommend reading the [Known Issues](#known-issues) section before setting up the module.

## Quick Setup

Add the module to your Nuxt application in one command:

```bash
npx nuxt module add @minch/nuxt-feedback
```

To add manually, install the `@minch/nuxt-feedback` package using your package manager of choice and add it to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["@minch/nuxt-feedback"],

  feedbackWidget: {
    method: "email", // Required: Choose your submission method
    siteName: "My App", // Optional: Default is "Your Nuxt App"
  },
});
```

Define environment variables for your selected method. [Read more below](#environment-variables).

That's it! You can now start using `<FeedbackWidget />` in your components.

## Configuration

### Module Options

Configure the module in your `nuxt.config.ts` under the `feedbackWidget` property:

```ts
export default defineNuxtConfig({
  modules: ["@minch/nuxt-feedback"],

  feedbackWidget: {
    method: "email", // Required: 'email' | 'github' | 'custom-endpoint'
    siteName: "My App", // Optional: Used in emails and GitHub issues
    customEndpoint: "/api/custom-handler", // Required only for 'custom-endpoint' method
  },
});
```

#### Module Options Reference

| Option           | Type                                       | Required | Default           | Description                                                        |
| ---------------- | ------------------------------------------ | -------- | ----------------- | ------------------------------------------------------------------ |
| `method`         | `'email' \| 'github' \| 'custom-endpoint'` | ✅       | -                 | Feedback submission method                                         |
| `siteName`       | `string`                                   | ❌       | `"Your Nuxt App"` | Site name used in feedback submissions                             |
| `customEndpoint` | `string`                                   | ❌       | -                 | Custom endpoint path (required when method is `'custom-endpoint'`) |

### Environment Variables

Depending on your chosen method, add the required environment variables to your `runtimeConfig`:

```ts
export default defineNuxtConfig({
  // ... module config above

  runtimeConfig: {
    // For Email method (via Resend)
    resendApiKey: process.env.RESEND_API_KEY,
    resendFrom: process.env.RESEND_FROM_EMAIL,
    resendTo: process.env.RESEND_TO_EMAIL,

    // For GitHub method
    githubToken: process.env.GITHUB_TOKEN,
    githubRepo: process.env.GITHUB_REPO,
    githubOwner: process.env.GITHUB_OWNER,
  },
});
```

#### Environment Variables Reference

**Email Method (Resend)**

- `RESEND_API_KEY`: Your Resend API key
- `RESEND_FROM_EMAIL`: Email address to send from (must be verified in Resend)
- `RESEND_TO_EMAIL`: Email address to receive feedback

**GitHub Method**

- `GITHUB_TOKEN`: GitHub personal access token with repo permissions
- `GITHUB_REPO`: Repository name (e.g., "my-project")
- `GITHUB_OWNER`: Repository owner username or organization

## Usage

### Basic Usage

Add the widget to your layout or page:

```vue
<template>
  <div>
    <!-- Your content -->
    <FeedbackWidget />
  </div>
</template>
```

### Customizing the Widget

The `<FeedbackWidget />` component accepts several props for customization:

```vue
<template>
  <FeedbackWidget
    title="Send us feedback!"
    description="We value your thoughts and suggestions."
    trigger-label="💬 Feedback"
    submit-label="Send Feedback"
    with-topics
    :topics="['General', 'Bug Report', 'Feature Request', 'UI/UX']"
  />
</template>
```

#### Component Props Reference

```ts
interface FeedbackUIProps {
  title?: string;
  description?: string;
  triggerLabel?: string;
  triggerClass?: string;
  submitLabel?: string;
  withTopics?: boolean;
  topics?: string[];
}
```

| Prop           | Type       | Default                                                 | Description                                   |
| -------------- | ---------- | ------------------------------------------------------- | --------------------------------------------- |
| `title`        | `string`   | `"Feedback"`                                            | Title displayed in the feedback modal         |
| `description`  | `string`   | `"Tell us what you think."`                             | Description text in the modal                 |
| `triggerLabel` | `string`   | `"Feedback"`                                            | Text for the trigger button                   |
| `triggerClass` | `string`   | `""`                                                    | Additional classes for the trigger button. The widget renders in a shadow root, so only classes bundled with the widget apply; use `::part(trigger)` for anything else |
| `submitLabel`  | `string`   | `"Submit"`                                              | Text for the submit button                    |
| `withTopics`   | `boolean`  | `true`                                                  | Whether to show the topics selector           |
| `topics`       | `string[]` | `["General Feedback", "Bug Report", "Feature Request"]` | Array of available feedback topics            |

### Using the Composable

Control the widget programmatically using the `useFeedbackWidget` composable:

```vue
<script setup lang="ts">
const { isOpen, openWidget, closeWidget } = useFeedbackWidget();

// Open widget programmatically
function handleButtonClick() {
  openWidget();
}
</script>

<template>
  <div>
    <button @click="handleButtonClick">Give Feedback 💝</button>

    <!-- Widget state -->
    <p v-if="isOpen">Widget is currently open</p>
  </div>
</template>
```

> **Note**
>
> You still need to add the `<FeedbackWidget />` component to your app somewhere. If you would like to hide the default trigger and programmatically toggle the widget using your means, you can hide it with CSS: `nuxt-feedback-widget::part(trigger) { display: none; }`.

#### Composable API

```ts
interface UseFeedbackWidget {
  isOpen: Ref<boolean, boolean>; // Current widget state
  openWidget: () => void; // Open the widget
  closeWidget: () => void; // Close the widget

  // For Internal Use
  isWidgetMounted: Readonly<Ref<boolean, boolean>>;
  registerWidget: () => void;
  unregisterWidget: () => void;
}
```

## Submission Methods

### Email (Resend)

Sends feedback via email using the Resend service.

**Setup:**

1. Sign up for [Resend](https://resend.com)
2. Get your API key and verify your domain
3. Set environment variables:

```env
RESEND_API_KEY=your_api_key
RESEND_FROM_EMAIL=feedback@yourdomain.com
RESEND_TO_EMAIL=admin@yourdomain.com
```

You can learn more about Resend from [their docs](https://resend.com/docs)

**Configuration:**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@minch/nuxt-feedback"],

  feedbackWidget: {
    method: "email",
    siteName: "My Awesome App"
  }

  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,
    resendFrom: process.env.RESEND_FROM_EMAIL,
    resendTo: process.env.RESEND_TO_EMAIL
  }
});
```

### GitHub Issues

Creates GitHub issues for each feedback submission.

**Setup:**

1. Create a GitHub personal access token (PAT) with read and write permissions to a repo of your choice.
2. Set environment variables:

```env
GITHUB_TOKEN=your_github_token
GITHUB_REPO=your-repo-name # Can be a private repo
GITHUB_OWNER=your-username-or-org
```

**Configuration:**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@minch/nuxt-feedback"],

  feedbackWidget: {
    method: "github",
    siteName: "My Awesome App"
  }

  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    githubRepo: process.env.GITHUB_REPO,
    githubOwner: process.env.GITHUB_OWNER
  }
});
```

### Custom Endpoint

Forwards feedback to your own API endpoint for custom processing.

**Configuration:**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@minch/nuxt-feedback"],

  feedbackWidget: {
    method: "custom-endpoint",
    customEndpoint: "/api/my-custom-handler",
    siteName: "My Awesome App",
  },
});
```

**Feedback Data Structure:**

```ts
interface FeedbackDataType {
  topic: string; // Selected topic
  reaction: string; // Feedback reaction
  message: string; // User's optional message
  siteName: string; // Your configured site name
  metadata: {
    route: {
      fullPath: string;
      hash: string;
      query: LocationQuery;
      name: RouteRecordNameGeneric;
      path: string;
      redirectedFrom: RouteLocationGeneric | undefined;
    };
    time: {
      timestamp: string; // ISO string
      timezone: string; // User's timezone
    };
  };
}
```

> **Imporant:** The feedback data is forwarded as is to your custom endpoint. Since user input can't be trusted, you'll need to implement some form of sanitization in your endpoint.

**Example Custom Handler:**

```ts
// ~/server/api/my-custom-handler.ts
export default defineEventHandler(async (event) => {
  try {
    const rawFeedback = await readBody(event);

    // Sanitize input
    const feedback = sanitizer(rawFeedback);

    // Save to database
    await db.insert(feedback);

    // Send to analytics
    await $fetch("/api/analytics", {
      method: "POST",
      body: {
        event: "feedback_submitted",
        properties: {
          topic: feedback.topic,
          route: feedback.metadata.route.path,
        },
      },
    });

    return { success: true };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to process feedback",
    });
  }
});
```

> **Note**
>
> Your server route doesn't need to return anything.
>
> All error is handled at the default endpoint that sends the request to your custom endpoint. When an error occurs in your endpoint, it's a good idea to either return or throw the error. That way the appropriate success/failure messages will be displayed to the user.

## Examples

### Different Styling Approaches

**Minimal trigger:**

```vue
<template>
  <FeedbackWidget
    trigger-label="?"
  />
</template>

<style>
nuxt-feedback-widget::part(trigger) {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
}
</style>
```

**Integrated in navigation:**

```vue
<template>
  <FeedbackWidget
    trigger-label="Feedback"
    title="Help us improve"
    description="Your feedback helps us build a better product"
  />
</template>
```

### Topic-specific Feedback

```vue
<template>
  <FeedbackWidget
    :topics="['Account', 'AI', 'Billing', 'Documentation', 'Observability']"
    with-topics
    title="Report an Issue"
    description="Let us know what's not working"
  />
</template>
```

### Programmatic Control

> This approach currently has some issues.

```vue
<script setup lang="ts">
const { openWidget } = useFeedbackWidget();

// Show feedback after user completes action
async function handleTaskComplete() {
  await saveUserProgress();

  // Prompt for feedback
  setTimeout(() => {
    openWidget();
  }, 1000);
}
</script>
```

## Known Issues

A list of issues I have noticed and I'm working on a fix for:

- The widget doesn't currently work on fully static sites such as ones deployed to GitHub Pages as it requires a server for submitting feedback.
- The `useFeedbackWidget` composable doesn't detect the `<FeedbackWidget />` component properly.

## Troubleshooting

Feel free to open an issue if you are not able to resolve an issue.

### Common Issues

**Widget not appearing:**

- Ensure the module is properly added to your `nuxt.config.ts`
- Check that you've set a valid `method` in your configuration
- Verify the component is imported (it should be auto-imported) and added to your app

**Styling conflicts:**

- The widget is rendered inside a shadow root, so your app's CSS (including Tailwind) does not affect it and vice versa
- Style the trigger from your own CSS with `nuxt-feedback-widget::part(trigger)`

**Submission failures:**

- Check your environment variables are set correctly
- Verify API keys and tokens have proper permissions
- Check the browser console and server logs for errors

**Multiple widgets appearing:**

- Make sure you only have one `<FeedbackWidget />` component per page. This issue will likely be resolved in a future release.

**Method not found:**

- Ensure your `method` is one of: `'email'`, `'github'`, or `'custom-endpoint'`
- Check spelling in your configuration

### Error Handling

The module includes built-in error handling:

- Invalid configurations show warnings in development
- Failed submissions display user-friendly error messages
- Server errors are logged for debugging

If you encounter issues, check:

1. Browser developer console
2. Server logs
3. Network tab for API request failures

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm run dev:prepare
  
  # Develop with the playground
  pnpm run dev
  
  # Build the playground
  pnpm run dev:build
  
  # Run ESLint
  pnpm run lint
  
  # Run Vitest
  pnpm run test
  pnpm run test:watch
  
  # Release new version
  pnpm run release
  ```
</details>

## License

[MIT](/LICENSE)

© 2025-present [Dawit Urgessa](https://minch.dev)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@minch/nuxt-feedback/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@minch/nuxt-feedback
[license-src]: https://img.shields.io/npm/l/@minch/nuxt-feedback.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@minch/nuxt-feedback
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com

<!--
[npm-downloads-href]: https://npm.chart.dev/nuxt-feedback-widget
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-feedback-widget.svg?style=flat&colorA=020420&colorB=00DC82
-->
