import { defineEventHandler, readBody } from "#imports";

export default defineEventHandler(async (event) => {
  // Read and validate request body
  const body = await readBody(event);

  console.log(
    "Received submission from custom endpoint:\n",
    JSON.stringify(body, null, 2),
  );

  // throw createError(
  //   "Custom feedback endpoint is not implemented yet. Please check back later.",
  // );
});
