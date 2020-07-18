const form = document.getElementById("form");
const title = document.getElementById("title");
const sButton = document.getElementById("submit-btn");
const message = document.getElementById("message");
// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

// Show success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

// Check required fields
function checkRequired(inputArr) {
  let val = true;
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
      val = val && false;
    } else {
      showSuccess(input);
      val = val && true;
    }
  });
  return val;
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
    return false;
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

// Get fieldname
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}
// Event listeners
function submitForm(e) {
  e.preventDefault();
  let val = true;
  val = checkRequired([title, message]) && val;
  val = checkLength(title, 3, 100) && val;
  val = checkLength(message, 10, 60000) && val;

  if (val === true) {
    form.submit();
  }
}
sButton.addEventListener("click", submitForm);
