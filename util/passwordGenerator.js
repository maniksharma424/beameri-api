export const randomPasswordGenerator = () => {
  const digits =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()+|}{[]?/=";
  let password = "";
  const passwordLength = 8;
  for (let i = 0; i < passwordLength; i++) {
    password += digits[Math.floor(Math.random() * digits.length)];
  }
  return password;
};
