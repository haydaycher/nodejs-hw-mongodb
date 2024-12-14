import 'dotenv/config';

// export const env = (name, defaultValue) => {
//   const value = process.env[name];

//   if (value) return value;
//   if (defaultValue) return defaultValue;

//   throw new Error(`Missing procced.env[${name}]`);
// };

export const env = (name, defaultValue) => {
  const value = process.env[name];

  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error(`Missing required environment variable: ${name}`);
};
