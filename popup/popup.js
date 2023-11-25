let tasks = [];
let currTask = {};

function updateTime() {
  chrome.storage.local.get(["timer"], (res) => {
    const time = document.getElementById("time");
    const hours = `${Math.floor(res.timer / 60)}`.padStart(2, "0");
    const minutes = `${60 - Math.ceil(res.timer / 60)}`.padStart(2, "0");
    let seconds = "00";
    if (res.timer % 60 !== 0) {
      seconds = `${60 - (res.timer % 60)}`.padStart(2, "0");
    }
    time.textContent = `${hours}:${minutes}:${seconds}`;
  });
}

updateTime();
setInterval(updateTime, 1000);

const startTimerBtn = document.getElementById("start-timer");
startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startTimerBtn.textContent = !res.isRunning
          ? "Pause Timer"
          : "Start Timer";
      }
    );
  });
});

const resetTimerBtn = document.getElementById("reset-timer");
resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startTimerBtn.textContent = "Start Timer";
    }
  );
});

const addTaskBtn = document.getElementById("add-task");
addTaskBtn.addEventListener("click", () => addTask());

function selectTask(task) {
  currTask.text = task.text;
  currTask.date = task.date;
  chrome.storage.sync.set({ currTask: currTask }, () => {});
}

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  });
}

function renderTask(task, index) {
  const taskRow = document.createElement("div");
  console.log(task);
  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task...";
  text.value = task.text;
  const currTask = tasks[index];
  text.addEventListener("change", () => {
    currTask.text = text.value;
    saveTasks();
  });
  const date = document.createElement("input");
  date.type = "number";
  date.placeholder = "Minutes";
  date.value = task.date;
  date.addEventListener("change", () => {
    currTask.date = date.value;
    saveTasks();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "x";
  deleteBtn.addEventListener("click", () => {
    deleteTask(index);
  });

  const startBtn = document.createElement("input");
  startBtn.type = "button";
  startBtn.value = ">";
  startBtn.addEventListener("click", () => {
    selectTask(task);
    deleteTask(index);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(date);
  taskRow.appendChild(startBtn);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.getElementById("task-container");
  taskContainer.appendChild(taskRow);
}

function startTask(taskNum) {
  return;
}

function addTask() {
  let newObj = new Object();
  newObj.text = "";
  newObj.date = 0;
  tasks.push(newObj);
  renderTasks();
  saveTasks();
}

function deleteTask(task) {
  tasks.splice(task, 1);
  renderTasks(task);
  saveTasks();
}

function renderTasks() {
  const taskContainer = document.getElementById("task-container");
  taskContainer.textContent = "";
  tasks.forEach((task, index) => {
    renderTask(task, index);
  });
}
