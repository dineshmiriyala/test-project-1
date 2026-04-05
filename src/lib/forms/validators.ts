const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returning user-friendly strings here keeps the form components very small.
export function validateEmail(email: string) {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail) {
    return "Enter an email address.";
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return "Enter a valid email address.";
  }

  return "";
}

export function validatePassword(password: string) {
  if (!password.trim()) {
    return "Enter a password.";
  }

  if (password.trim().length < 8) {
    return "Use at least 8 characters.";
  }

  return "";
}

export function validateDisplayName(name: string) {
  if (!name.trim()) {
    return "Enter your name.";
  }

  if (name.trim().length < 2) {
    return "Use at least 2 characters.";
  }

  return "";
}
