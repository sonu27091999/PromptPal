const isDev = import.meta.env.MODE === "development";

export const log = (...args) => {
  if (isDev) console.log(...args);
};

export const warn = (...args) => {
  if (isDev) console.warn(...args);
};

export const error = (...args) => {
  console.error(...args); // Always show errors
};
