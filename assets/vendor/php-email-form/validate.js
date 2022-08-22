const form = document.getElementById("contactForm");
const success = document.querySelector(".sent-message");
const error = document.querySelector(".error-message");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const searchParams = new URLSearchParams();

  for (const pair of formData) {
    searchParams.append(pair[0], pair[1]);
  }

  if (grecaptcha.getResponse() == "") {
    errorMsg();
  } else {
    fetch("https://api.web3forms.com/submit", {
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
  }
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
  error.textContent === '' ? error.textContent = 'Hubo un error al enviar el formulario. Verificar que todos los campos estén completos.' : null;
  setTimeout(function () {
    error.style.display = "none";
  }, 3000);
  success.style.display = "none";
}