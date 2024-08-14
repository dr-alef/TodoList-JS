
const alertTodo = document.getElementById("alert-todo");
const addTodo = document.getElementById("add-btn");
const editTodo = document.getElementById("edit-btn");
const addTodoTask = document.getElementById("subject-todo");
const addTodoDate = document.getElementById("date-todo");
const todosBody = document.querySelector("tbody");
const deleteTodos = document.getElementById("delete-todos");
const filterButtons = document.querySelectorAll(".filter-todos");



let todos = JSON.parse(localStorage.getItem("todos")) || [];

//Add Todo
const addTodoHandler = () => {

    const taskTodo = addTodoTask.value;
    const taskDate = addTodoDate.value;
    const todo = {
        id: generateID(),
        task: taskTodo,
        date: taskDate,
        completed: false
    }
    if (taskTodo) {
        todos.push(todo);
        saveToLocalStorage();
        addTodoTask.value = "";
        addTodoDate.value = "";
        messageHandler("Todo Added Succesfully", "succes");
    } else {
        messageHandler("Please add your Todo", "error");
    }
    displayTodos()
}

//Show Message
const messageHandler = (message, type) => {
    alertTodo.innerHTML = ""
    const alert = document.createElement("p");
    alert.innerText = message;
    alertTodo.append(alert);
    alert.classList.add(`alert`);
    alert.classList.add(`alert-${type}`);

    setTimeout(() => {
        alert.style.display = "none";
    }, 2000)
}

//Generate Id
const generateID = () => {
    const id = Math.round(Math.random() * Math.random() * Math.pow(5, 10));
    return id;

}
//Show Todo In Table
const displayTodos = (data) => {
    const todoList = data || todos;
    todosBody.innerHTML = "";
    todoList.forEach(todo => {
        todosBody.innerHTML +=
            `            
    <tr>
      <td>${todo.task}</td>
      <td>${todo.date ? todo.date : "No Date"}</td>
      <td>${todo.completed ? "Completed" : "Pending"}</td>
      <td>
      <button onclick="editItemHandler(${todo.id})">edit</button>
      <button onclick="togleStatusItemHandler(${todo.id})">${todo.completed ? "Undo" : "Do"}</button>
      <button onclick="deleteItemHandler(${todo.id})">delete</button>
      </td>
    </tr>
`
    });
}
//Delete Todo
const deleteItemHandler = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    todos = newTodos;
    saveToLocalStorage();
    displayTodos();
    messageHandler("Delete Todo Seuccesfully", "succes");

}
//Delete all todos
const deleteAllTodos = () => {
    if (todos.length) {
        todos = [];
        saveToLocalStorage();
        displayTodos();
        messageHandler("Todos Deleted Succesfully", "succes");
    } else {
        messageHandler("Not Todos Found", "error");
    }

}
//Change Status Todo
const togleStatusItemHandler = (id) => {
    const newTodos = todos.map((todo) => {
        if (todo.id === id) {
            return {
                ...todo,
                completed: !todo.completed
            }
        } else {
            return todo;
        }
    })
    todos = newTodos
    saveToLocalStorage();
    displayTodos();
    messageHandler("Todo Status Changed Succesfully", "succes");
}

//Edit Todo
const editItemHandler = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    addTodoTask.value = todo.task;
    addTodoDate.value = todo.date;
    addTodo.style.display = "none";
    editTodo.style.display = "inline-block";
    editTodo.dataset.id = id;
}

const applyEditHandler = (e) => {
    const id = e.target.dataset.id;
    const todo = todos.find((todo) => todo.id === id);
    console.log(todo);
    todo.task = addTodoTask.value;
    todo.date = addTodoDate.value;
    addTodoTask.value = "";
    addTodoDate.value = "";
    addTodo.style.display = "inline-block";
    editTodo.style.display = "none";
    saveToLocalStorage();
    displayTodos();
    messageHandler("Todo Edited Succesfully", "succes");
}
//save to LocalStorage
const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
}
//Categury Todos
const filterTodoHandler = (e) => {
    let filterTodos = null;
    const filter = e.target.dataset.filter;
    switch (filter) {
        case "pending":
            filterTodos = todos.filter((todo) => todo.completed === false);
            break;
        case "completed":
            filterTodos = todos.filter((todo) => todo.completed === true);
            break;
        default:
            filterTodos = todos;
            break;
    }
    displayTodos(filterTodos);
}

editTodo.addEventListener("click", applyEditHandler);
window.addEventListener("load", () => displayTodos());
deleteTodos.addEventListener("click", deleteAllTodos);
addTodo.addEventListener("click", addTodoHandler);
filterButtons.forEach((button) => {
    button.addEventListener("click", filterTodoHandler);
});

