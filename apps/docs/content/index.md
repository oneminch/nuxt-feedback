::site-header
:logo

:theme-toggle
::

A simple & customizable feedback widget for your Nuxt apps.

::warning  
Nuxt Feedback is under active development; expect the API to change between releases.
<br /><br />
Refer to the [Known Issues](#known-issues) section if you encounter any issues.
::

::toc{:links="toc"}
::

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
    siteName: "My App", // Optional: Default is "My Nuxt App"
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
| `method`         | `'email'` \| `'github'` \| `'custom-endpoint'` | ✅       | -                 | Feedback submission method                                         |
| `siteName`       | `string`                                   | ❌       | `"My Nuxt App"` | Site name used in feedback submissions                             |
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
| `triggerClass` | `string`   | `""`                                                    | Additional classes for the trigger button. The trigger is a regular `<button>` in your page, so your own CSS and utility classes apply |
| `submitLabel`  | `string`   | `"Submit"`                                              | Text for the submit button                    |
| `withTopics`   | `boolean`  | `true`                                                  | Whether to show the topics selector           |
| `topics`       | `string[]` | `["General Feedback", "Bug Report", "Feature Request"]` | Array of available feedback topics            |

#### Style Overrides with CSS Variables

The widget supports style overrides through namespaced CSS variables.

- Use `--nfw-*` variables to customize the modal UI rendered inside the `nuxt-feedback-widget` custom element.
- Use `--nfw-trigger-*` variables to customize the default trigger button styles.

```css
/* Modal styles (inside the custom element shadow root) */
nuxt-feedback-widget {
  --nfw-primary: oklch(64.5% 0.246 16.439);
  --nfw-primary-foreground: oklch(97.1% 0.013 17.38);
  --nfw-ring: oklch(64.5% 0.246 16.439);
  --nfw-radius: 0.75rem;
  --nfw-radio-checked-border: oklch(64.5% 0.246 16.439);
  --nfw-radio-checked-background: oklch(97.1% 0.013 17.38);
}

/* Dark mode overrides for the modal */
.dark nuxt-feedback-widget {
  --nfw-primary: oklch(76.9% 0.188 70.08);
  --nfw-primary-foreground: oklch(26.6% 0.079 36.259);
  --nfw-ring: oklch(76.9% 0.188 70.08);
  --nfw-radio-checked-border: oklch(76.9% 0.188 70.08);
  --nfw-radio-checked-background: oklch(39.4% 0.095 152.535);
}

/* Default trigger button styles */
button.feedback-trigger {
  --nfw-trigger-background: oklch(98.5% 0.001 106.423);
  --nfw-trigger-foreground: oklch(27.4% 0.006 286.033);
  --nfw-trigger-accent: oklch(96.7% 0.001 286.375);
  --nfw-trigger-accent-foreground: oklch(21% 0.006 285.885);
  --nfw-trigger-ring: oklch(64.5% 0.246 16.439);
}
```

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
> The modal is mounted automatically by the module, so `useFeedbackWidget()` works without adding `<FeedbackWidget />` to a template. Add `<FeedbackWidget />` only if you want its default trigger button; you can hide that button with CSS, e.g. `trigger-class="hidden"`.
> In static/no-server deployments (for example `nuxt generate` or static output presets like `github-pages`), `openWidget()` is intentionally a no-op and the default trigger is disabled.

#### Composable API

```ts
interface UseFeedbackWidget {
  isOpen: Ref<boolean, boolean>; // Current widget state
  openWidget: () => void; // Open the widget
  closeWidget: () => void; // Close the widget
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
      name: RouteRecordNameGeneric; // From vue-router
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

> **Imporant:** The feedback data is forwarded as is to your custom endpoint. Since user input can't be trusted, you might need to implement some form of sanitization in your endpoint.

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
button.feedback-trigger {
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

> This approach currently has [some issues](#known-issues).

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

- On fully static sites (for example GitHub Pages), the module auto-detects no server, disables the trigger, and blocks feedback submissions.

## Troubleshooting

Feel free to open an issue to report bugs or suggest features.

### Common Issues

**Widget not appearing:**

- Ensure the module is properly added to your `nuxt.config.ts`
- Check that you've set a valid `method` in your configuration
- Verify the component is imported (it should be auto-imported) and added to your app

**Submission failures:**

- Check your environment variables are set correctly
- Verify API keys and tokens have proper permissions
- Check the browser console and server logs for errors

**Multiple widgets appearing:**

- Multiple `<FeedbackWidget />` triggers share a single modal; the most recently updated widget's title, description and topics are used.

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
