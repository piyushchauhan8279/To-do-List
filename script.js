const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const categorySelect = document.getElementById("category");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progressText");

// Load from storage
window.onload = () => {
  let theme = localStorage.getItem("theme");
  if (theme === "dark") document.body.classList.add("dark");

  let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task =>
    addTaskToUI(task.text, task.completed, task.dueDate, task.category)
  );
  updateProgress();
};

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const category = categorySelect.value;
  if (text === "") return;

  addTaskToUI(text, false, dueDate, category);
  saveTasks();
  taskInput.value = "";
  dueDateInput.value = "";
}

function addTaskToUI(text, completed, dueDate, category) {
  const li = document.createElement("li");

  const info = document.createElement("div");
  info.className = "task-info";

  const mainText = document.createElement("span");
  mainText.textContent = text;
  info.appendChild(mainText);

  const meta = document.createElement("span");
  meta.className = "meta";
  meta.textContent = `${category} | Due: ${dueDate || "No date"}`;
  info.appendChild(meta);

  if (completed) li.classList.add("completed");

  // Overdue check
  if (dueDate && new Date(dueDate) < new Date() && !completed) {
    li.classList.add("overdue");
  }

  li.appendChild(info);

  // toggle complete
  li.addEventListener("click", function (e) {
    if (e.target.tagName !== "BUTTON") {
      li.classList.toggle("completed");
      saveTasks();
      updateProgress();
    }
  });

  // buttons
  const btnGroup = document.createElement("div");
  btnGroup.className = "btn-group";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "btn edit";
  editBtn.onclick = function (e) {
    e.stopPropagation();
    let newText = prompt("Edit task:", text);
    if (newText) {
      mainText.textContent = newText;
      saveTasks();
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "btn delete";
  deleteBtn.onclick = function (e) {
  e.stopPropagation();
  li.style.opacity = "0";
  li.style.transform = "translateX(-50px)";
  setTimeout(() => {
    li.remove();
    saveTasks();
    updateProgress();
  }, 300);
};


  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(deleteBtn);
  li.appendChild(btnGroup);

  taskList.appendChild(li);
  updateProgress();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    const text = li.querySelector(".task-info span:first-child").textContent;
    const metaText = li.querySelector(".meta").textContent;
    const [categoryPart, duePart] = metaText.split("|");
    const category = categoryPart.trim();
    const dueDate = duePart.replace("Due:", "").trim();
    tasks.push({
      text,
      completed: li.classList.contains("completed"),
      dueDate: dueDate === "No date" ? "" : dueDate,
      category
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearAll() {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
  updateProgress();
}

function updateProgress() {
  const allTasks = document.querySelectorAll("#taskList li");
  const completed = document.querySelectorAll("#taskList li.completed");
  const percent = allTasks.length
    ? Math.round((completed.length / allTasks.length) * 100)
    : 0;
  progressBar.style.width = percent + "%";
  progressText.textContent = `${percent}% completed`;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}
