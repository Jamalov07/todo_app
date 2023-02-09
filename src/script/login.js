let username = document.getElementById("address");
let password = document.getElementById("passwordin");
let signin = document.getElementById("signin");

function submitLogin() {
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

signin.addEventListener("submit", (e) => {
  e.preventDefault();
  submitLogin();
});

async function signUpSubmit(user) {
  //"http://3.92.175.77:4000/user/register"
  // "http://178.62.198.221:3003/user/register"
  const response = await fetch("http://3.92.175.77:4000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  console.log(response);
  if (response.status == 401) {
    alert(
      "siz ro'yhatdan o'tmagansiz, username va parolingizni yaxshilab eslang yoki yang hisob oching"
    );
  } else {
    const result = await response.json();
    if (response.status == 201) {
      window.location.replace("./index.html");
    }
    localStorage.setItem("refresh_token", result.tokens.refresh_token);
    localStorage.setItem("id", result.user.id);
    localStorage.setItem("username", result.user.username);

    console.log(result);
  }
}
