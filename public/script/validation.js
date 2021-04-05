const form = document.querySelector(".entreForm");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");

form.addEventListener("submit", (e) => {
  if (password.value.trim() === "") {
    password.style.border = "1px solid red";
    e.preventDefault();
  } else if (password.value.trim() !== password2.value.trim()) {
    password2.style.border = "1px solid red";
    e.preventDefault();
  } else {
    password2.style.border = "1px solid green";
  }
});
