interface FormErrors {
  [key: string]: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

export const validateForm = (formData: FormData): FormErrors => {
  const newErrors: FormErrors = {};

  if (!formData.name) {
    newErrors.name = "Name is required";
  } else if (formData.name.length < 3) {
    newErrors.name = "Name must be at least 3 characters";
  }

  if (!formData.email) {
    newErrors.email = "Email is required";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Name must be at least 6 characters";
  }

  return newErrors;
};
export const validateLoginForm = (formData: LoginFormData): FormErrors => {
  const newErrors: FormErrors = {};

  if (!formData.email) {
    newErrors.email = "Email is required";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Name must be at least 6 characters";
  }

  return newErrors;
};
