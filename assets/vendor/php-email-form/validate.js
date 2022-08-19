const form = document.getElementById("contactForm");
const success = document.querySelector(".sent-message");
const error = document.querySelector(".error-message");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const searchParams = new URLSearchParams();

  for(const pair of formData) {
    searchParams.append(pair[0], pair[1]);
  }

  fetch("forms/contact.php", {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      form.reset();
      successMsg();
      return response.text();
    })
    .catch(function (error) {
      errorMsg();
      console.log(error);
    });
});

function successMsg() {
  success.style.display = "block";
  setTimeout(function () {
    success.style.display = "none";
  }, 3000);
  error.style.display = "none";
}

function errorMsg() {
  error.style.display = "block";
  setTimeout(function () {
    error.style.display = "none";
  }, 3000);
  success.style.display = "none";
}