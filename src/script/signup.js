// ========================= sign up

let username = document.getElementById("email-address");
let password = document.getElementById("password");
let signup = document.getElementById("signup");

function submitSignUp() {
  const user = {
    username: username.value,
    password: password.value,
  };
  if (user.password.trim().length === 0 || user.username.trim().length === 0) {
    console.log("error");
  } else {
    signUpSubmit(user);
  }
}

signup.addEventListener("submit", (e) => {
  e.preventDefault();
  submitSignUp();
});

async function signUpSubmit(user) {
  //"http://3.92.175.77:4000/user/register"
  // "http://178.62.198.221:3003/user/register"
  const response = await fetch("http://3.92.175.77:4000/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (response.status == 201) {
    window.location.replace("./login.html");
  }
  const result = await response.json();
  if (result.statusCode == 400) {
    alert("Bu username band boshqa username tanglang");
  }
  console.log(result);
}
