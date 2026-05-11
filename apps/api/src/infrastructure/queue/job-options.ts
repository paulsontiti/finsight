export const defaultJobOptions = {
  attempts: 5,

  backoff: {
    type: "exponential",
    delay: 2000,
  },

  removeOnComplete: 100,

  removeOnFail: false,
};