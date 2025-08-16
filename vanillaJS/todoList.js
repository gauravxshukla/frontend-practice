// Write your JavaScript here.
export function todoList() {
  const $rootEl = document.getElementById("app");
  const $taskHeading = document.createElement("h1");
  $taskHeading.innerText = "Todo List";

  const taskList = ['Walk the dog', 'Water the plants', 'Wash the dishes'];
  // Task form
  const $taskForm = document.createElement("form");
  $taskForm.style.marginBottom = "20px";


  $taskForm.innerHTML = `
        <input type='text' name='task' id='task' placeholder="Add your task" required/>
        <input type="submit" name="Submit" />
    `;

  $taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const $newTask = document.getElementById("task");
    taskList.push($newTask.value);
    renderTask();
  });

  //Task List
  const $allTaskList = document.createElement("div");
  function renderTask() {
    $allTaskList.innerHTML = ""; // Clear existing content

    taskList.map((taskDesc, index) => {
      const $newTask = document.createElement("div");
      $newTask.classList.add("task");

      //Adding text content
      const $taskTextContent = document.createElement("p");
      $taskTextContent.innerText = taskDesc;

      const $taskDeleteButton = document.createElement("button");
      $taskDeleteButton.innerHTML = "Delete";
      $taskDeleteButton.style.height = "20%";

      $taskDeleteButton.addEventListener("click", (e) => {
        deleteTask(taskDesc);
      });
      $newTask.appendChild($taskTextContent);
      $newTask.appendChild($taskDeleteButton);
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
}
