"use strict";

let exit = document.querySelector("#exit");
let token = localStorage.getItem("refresh_token");
let mainList = document.querySelector(".list");
let username = document.querySelector("#username");
const toast = document.querySelector(".toast");
const notif = document.querySelector("#notif");
const submitform = document.querySelector("#submitform");
const taskTitle = document.querySelector("#task");
const doneTask = document.querySelector("#done");
const progressTask = document.querySelector("#progress");
const delTask = document.querySelectorAll(".del");
const editTask = document.querySelectorAll(".edit");
const chcekTask = document.querySelectorAll(".check");
const savedState = document.querySelector(".saved");
const changedState = document.querySelector(".changed");

var task;
(async function () {
  try {
    const response = await fetch("http://3.92.175.77:4000/user/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    task = await response.json();
    console.log(task);
  } catch (err) {
    console.log(err, "Error");
  }
})();

exit.addEventListener("click", () => {
  localStorage.clear();
  logOut();
});

function logOut() {
  let token = localStorage.getItem("refresh_token");
  if (!token) {
    window.location.replace("./signup.html");
  }
}

(function () {
  if (!token) {
    window.location.replace("./signup.html");
  }
})();

(function () {
  let token = localStorage.getItem("refresh_token");
  let user = localStorage.getItem("username");
  // console.log(user);
  if (!token) {
    window.location.replace("./login.html");
  } else {
    username.textContent = user;
  }
})();

async function listTasks() {
  try {
    const response = await fetch("http://3.92.175.77:4000/user/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const result = await response.json();
    console.log(result);
    if (response.status === 200) {
      return result;
    }
  } catch (error) {
    console.log(error);
  }
}

function renderTaskList(taskList) {
  if (taskList.length) {
    mainList.innerHTML = "";
    taskList.forEach((task) => {
      const taskItem = createElement(
        "li",
        "mt-3 w-full p-3 shadow-lg bg-white rounded-md mb-3 list_item",
        `<div class="saved flex justify-between">
          <p class="title text-xl">${task.title}</p>
          <div class="btn-group flex justify-between">
            <i data-del='${
              task.id
            }' class="del bx bx-trash text-2xl text-red-600 mx-2 active:text-red-800 cursor-pointer"></i>
            <i data-edit='${
              task.id
            }' class="edit bx bx-edit text-2xl text-sky-600 mx-2 active:text-sky-800 cursor-pointer"></i>
            <i data-check='${
              task.id
            }' class="check bx bx-check-circle text-2xl mx-2 ${
          task.status
            ? "text-green-600  active:text-green-800"
            : "text-black active:text-[#3a3a3a]"
        } cursor-pointer"></i>
          </div>
          </div>
          <div class="changed hidden rounded-sm border border-blue-400 border-spacing-1">
            <label for="edit-task" class="w-full">
              <input value='${
                task.title
              }' id="edit-task" type="text" placeholder="Edit task title" class="p-3 shadow focus:ring-4 w-full outline-none focus:ring-cyan-500"/>
            </label>
            <div class="edit-btns flex justify-evenly items-center">
              <i data-save='${
                task.id
              }' class="save bx bx-save text-2xl text-green-600 mx-2 active:text-green-800 cursor-pointer"></i>
              <i data-cancel='${
                task.id
              }' class="cancel bx bx-x text-2xl text-red-600 mx-2 active:text-red-800 cursor-pointer"></i>
            </div>
          </div> 
            `
      );
      taskItem.dataset.id = task.id;
      mainList.append(taskItem);
    });
  } else {
    mainList.innerHTML =
      "<h2 class='text-center text-2xl text-bold text-red-500'>NOT FOUND!</h2>";
  }
}

async function forAll(function1, function2) {
  function1(await function2());
}

function countTaskDone(taskList) {
  const done = taskList.filter((item) => item.status === true).length;
  const progress = taskList.filter((item) => item.status === false).length;
  doneTask.textContent = done;
  progressTask.textContent = progress;
}

async function addNewTask(e) {
  const newTask = {
    title: taskTitle.value,
    expired_time: new Date().setMonth(3),
  };
  const check = newTask.title.trim().length === 0;

  if (check) {
    alert("Please enter a title for a task");
  } else {
    try {
      const response = await fetch(`http://3.92.175.77:4000/user/newwork`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(newTask),
      });
      const result = await response.json();

      task.push(result);
      mainList.innerHTML = "";
      console.log(task);
      renderTaskList(task);
      forAll(countTaskDone, listTasks);

      forSuccess();
      if (response.status === 200) {
        mainList.innerHTML = "";
        forAll(renderTaskList, listTasks);
      } else if (response.status === 400) {
        alert("Bunday to do allaqachon qo'shilgan");
      }
    } catch (error) {
      console.log(error);
    }
    taskTitle.value = "";
  }
}

submitform.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewTask(e);
  mainList.innerHTML = "";
  forAll(renderTaskList, listTasks);
  forAll(countTaskDone, listTasks);
});

mainList.innerHTML = "";
forAll(renderTaskList, listTasks);
forAll(countTaskDone, listTasks);

function forSuccess() {
  console.log(432345676543);
  toast.classList.remove("bg-red-600");
  toast.classList.remove("bg-yellow-600");
  toast.classList.add("bg-green-600");
  toast.classList.toggle("-translate-y-[400px]");
  notif.textContent = "Successfully Added";
  setTimeout(() => {
    toast.classList.toggle("-translate-y-[400px]");
  }, 700);
}

function forEdit() {
  toast.classList.remove("bg-red-600");
  toast.classList.remove("bg-yellow-600");
  toast.classList.add("bg-green-600");
  notif.textContent = "Successfully Updated";
  toast.classList.toggle("-translate-y-[400px]");
  setTimeout(() => {
    toast.classList.toggle("-translate-y-[400px]");
  }, 700);
}

function forDelete() {
  toast.classList.remove("bg-yellow-600");
  toast.classList.add("bg-red-600");
  notif.textContent = "Successfully Deleted";
  toast.classList.toggle("-translate-y-[400px]");
  setTimeout(() => {
    toast.classList.toggle("-translate-y-[400px]");
  }, 700);
}

function forCancel() {
  toast.classList.remove("bg-yellow-600");
  toast.classList.add("bg-red-600");
  notif.textContent = "Successfully Canceled";
  toast.classList.toggle("-translate-y-[400px]");
  setTimeout(() => {
    toast.classList.toggle("-translate-y-[400px]");
  }, 700);
}

function forCheck(status) {
  toast.classList.remove("bg-red-600");
  console.log(status);
  toast.classList.remove("bg-yellow-600");
  toast.classList.add(`${status ? "bg-green-600" : "bg-yellow-600"}`);
  notif.textContent = status ? "Added to done list" : "Added to to-do list";
  toast.classList.toggle("-translate-y-[400px]");
  setTimeout(() => {
    toast.classList.toggle("-translate-y-[400px]");
  }, 700);
}

mainList.addEventListener("click", async (e) => {
  if (e.target.classList.contains(`del`)) {
    const id = e.target.getAttribute("data-del");
    const response = await fetch(`http://3.92.175.77:4000/user/del/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.status === 200) {
      console.log(response);
      mainList.innerHTML = "";
      task = task.filter((task) => task.id != id);
      renderTaskList(task);
      countTaskDone(task);
      forDelete();
    }
  } else if (e.target.classList.contains(`check`)) {
    const id = e.target.getAttribute("data-check");
    mainList.innerHTML = "";
    task.forEach(async (t) => {
      if (t.id == id) {
        if (t.status == true) {
          t.status = false;
        } else {
          t.status = true;
        }
        const response = await fetch(
          `http://3.92.175.77:4000/user/work/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log(response);
        const result = await response.json();
        let bool = result.status ? false : true;
        const response2 = await fetch(
          `http://3.92.175.77:4000/user/edit/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ status: bool }),
          }
        );
        if (response2.status === 200) {
          const result = await response2.json();
          console.log(result);
        }
        forCheck(t.status);
      }
    });
    renderTaskList(task);
    countTaskDone(task);
  } else if (e.target.classList.contains("edit")) {
    const id = e.target.getAttribute("data-edit");
    updateIgnoredTask(id);
    // console.log(id);
    const el = mainList.querySelector(`[data-id = "${id}"]`);
    // console.log(el);
    el.querySelector(".saved").classList.remove("flex");
    el.querySelector(".saved").classList.add("hidden");
    el.querySelector(".changed").classList.remove("hidden");
    el.querySelector(".changed").classList.add("flex");
  } else if (e.target.classList.contains("save")) {
    const id = e.target.getAttribute("data-save");
    const el = mainList.querySelector(`[data-id = "${id}"]`);
    // console.log(id);
    // ==========
    const savedState1 = el.querySelector(".saved");
    const p = savedState1.querySelector(".title");
    const changedState1 = el.querySelector(".changed");
    const input = changedState1.querySelector("#edit-task");
    if (!input.value) {
      alert("Please enter a new title");
    } else {
      let title = input.value;
      console.log(id);
      const response = await fetch(`http://3.92.175.77:4000/user/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title: title }),
      });
      if (response.status === 200) {
        const result = await response.json();
        console.log(result);
      }
      el.querySelector(".saved").classList.remove("hidden");
      el.querySelector(".saved").classList.add("flex");
      p.textContent = input.value;
      el.querySelector(".changed").classList.remove("flex");
      el.querySelector(".changed").classList.add("hidden");
      task.forEach((item) => {
        if (item.id == id) {
          item.title = input.value;
        }
      });
      mainList.innerHTML = "";
      renderTaskList(task);
      countTaskDone(task);
      forEdit();
    }
  } else if (e.target.classList.contains("cancel")) {
    const id = e.target.getAttribute("data-cancel");
    // console.log(id);
    const el = mainList.querySelector(`[data-id = "${id}"]`);
    el.querySelector(".saved").classList.remove("hidden");
    el.querySelector(".saved").classList.add("flex");
    el.querySelector(".changed").classList.remove("flex");
    el.querySelector(".changed").classList.add("hidden");
    forCancel();
  }
});

function updateIgnoredTask(id) {
  task.forEach((item) => {
    if (item.id != id) {
      const el = mainList.querySelector(`[data-id = "${item.id}"]`);
      el.querySelector(".saved").classList.remove("hidden");
      el.querySelector(".saved").classList.add("flex");
      el.querySelector(".changed").classList.remove("flex");
      el.querySelector(".changed").classList.add("hidden");
    }
  });
  mainList.innerHTML = "";
  renderTaskList(task);
  countTaskDone(task);
}
