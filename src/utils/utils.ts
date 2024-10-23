export const createResetPasswordLink = (
  baseUrl: string,
  token: string,
  email: string
) => {
  const url = new URL(`reset-password/${token}`, baseUrl);
  url.searchParams.append("email", email);
  return url.toString();
};
