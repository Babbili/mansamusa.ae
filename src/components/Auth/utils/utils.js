export const validateEmail = email => {
  let regexp = /^(([^<>()[\]\\.,;:\s@”]+(\.[^<>()[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email)
}

export const validatePassword = password => {
  let regexp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return regexp.test(password)
}

export const validateRePassword = (password, rePassword) => {
  return password === rePassword
}

export const validateName = email => {
  let regexp = /^[a-zA-Z]{3,}(?: [a-zA-Z]+){0,2}$/;
  return regexp.test(email)
}
