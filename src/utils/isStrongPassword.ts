export const isStrongPassword = (password: string) => {
  return (
    // Check lowercase presence
    /[a-z]+/.test(password) &&
    // Check uppercase presence
    /[A-Z]+/.test(password) &&
    // Check number presence
    /[0-9]+/.test(password) &&
    // Check length
    password.length >= 8
  );
};
