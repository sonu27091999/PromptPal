export const extractPageContext = () => {
  const excludedId = "__promptpal_ai_whisper_container";

  // Get all direct children of <body>
  const children = Array.from(document.body.children);

  // Filter out the one with the specific ID
  const filtered = children.filter((el) => el.id !== excludedId);

  // Combine the outerHTML of the remaining elements
  return filtered.map((el) => el.outerHTML).join("");
};
