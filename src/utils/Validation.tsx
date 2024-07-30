export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

export const isPasswordValid = (password: string): boolean => {
  return password.length >= 6;
};

export const isNameValid = (name: string): boolean => {
  return name.trim() !== '';
};

export const isWordAndTranslationValid = (word: string, translation: string): boolean => {
  if (word.trim() === "" || translation.trim() === "") {
    console.log("Word and translation cannot be empty");
    return false;
  }

  if (word.length > 30 || translation.length > 30) {
    console.log("Word and translation should not exceed 30 characters");
    return false;
  }

  return true;
};
