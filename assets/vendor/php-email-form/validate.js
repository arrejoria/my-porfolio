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

// const form = document.getElementById('form');
// const result = document.getElementById('result');

// form.addEventListener('submit', function(e) {
//     const formData = new FormData(form);
//     e.preventDefault();
//     var object = {};
//     formData.forEach((value, key) => {
//         object[key] = value
//     });
//     var json = JSON.stringify(object);
//     result.innerHTML = "Please wait..."

//     fetch('https://api.web3forms.com/submit', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             body: json
//         })
//         .then(async (response) => {
//             let json = await response.json();
//             if (response.status == 200) {
//                 result.innerHTML = json.message;
//             } else {
//                 console.log(response);
//                 result.innerHTML = json.message;
//             }
//         })
//         .catch(error => {
//             console.log(error);
//             result.innerHTML = "Something went wrong!";
//         })
//         .then(function() {
//             form.reset();
//             setTimeout(() => {
//                 result.style.display = "none";
//             }, 3000);
//         });
// });