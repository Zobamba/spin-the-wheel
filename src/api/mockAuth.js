const MOCK_DELAY_MS = 500;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Mocked stand-in for the login backend call. Accepts any non-empty
// email/password and returns a fake token, mirroring the shape of the
// real API response so callers don't need to change their handling.
export const mockLogin = async ({ email, password }) => {
  await delay(MOCK_DELAY_MS);

  if (!email || !password) {
    const error = new Error('Missing credentials');
    error.response = {
      data: { errors: [{ msg: 'Email and password are required' }] },
    };
    throw error;
  }

  const firstName = capitalize(email.split('@')[0] || 'Guest');

  return {
    data: {
      token: `mock-token-${Date.now()}`,
      data: { email, firstName },
    },
  };
};
