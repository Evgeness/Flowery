export const validateRegisterForm = (values: any) => {
  const errors: any = {};
  
  if (!values.name || values.name.length < 2) {
    errors.name = 'Имя должно содержать хотя бы 2 символа';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!values.email) {
    errors.email = 'Введите email';
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Некорректный формат email';
  }
  
  if (!values.password || values.password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов';
  }
  
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают';
  }
  
  return errors;
};