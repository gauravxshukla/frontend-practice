import "./styles.css";

function todoList() {
  const $rootEl = document.getElementById("app");
  const $taskHeading = document.createElement("h1");
  $taskHeading.innerText = "Todo List";

  const taskList = ["Walk the dog", "Water the plants", "Wash the dishes"];

  // Task form
  const $taskForm = document.createElement("form");
  $taskForm.style.marginBottom = "20px";
  $taskForm.innerHTML = `
    <input type="text" name="task" id="task" placeholder="Add your task" required />
    <input type="submit" value="Submit" />
  `;

  $taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const $newTask = document.getElementById("task");
    const value = $newTask.value.trim();
    if (!value) return;
    taskList.push(value);
    $newTask.value = "";
    renderTask();
  });

  // Task list
  const $allTaskList = document.createElement("div");

  function renderTask() {
    $allTaskList.innerHTML = "";

    taskList.forEach((taskDesc) => {
      const $newTask = document.createElement("div");
      $newTask.classList.add("task");

      const $taskTextContent = document.createElement("p");
      $taskTextContent.innerText = taskDesc;

      const $taskDeleteButton = document.createElement("button");
      $taskDeleteButton.innerText = "Delete";
      $taskDeleteButton.addEventListener("click", () => {
        deleteTask(taskDesc);
      });

      $newTask.append($taskTextContent, $taskDeleteButton);
      $allTaskList.append($newTask);
    });
  }

  function deleteTask(taskDesc) {
    const taskIndex = taskList.findIndex((item) => item === taskDesc);
    if (taskIndex !== -1) {
      taskList.splice(taskIndex, 1);
      renderTask();
    }
  }

  $rootEl.append($taskHeading, $taskForm, $allTaskList);
  renderTask();
}

todoList();
