// == MODEL SECTION ==

// === Model Section: Initial Data ===

// declare and initialize our default TODOS list
const TODOS = [{
    title: 'Get groceries',
    dueDate: '2022-10-03',
    id: 'id001'
}, {
    title: 'Wash car',
    dueDate: '2022-01-24',
    id: 'id002'
}, {
    title: 'Make dinner',
    dueDate: '2022-06-03',
    id: 'id003'
}];

// initialize (but do not declare yet) our todos
let todos;

// update status category
const statusCats = ['description', 'add', 'delete', 'reset'];
const statusSelected = statusCats[0];

// === Reset Data ===

function resetTodos() {
    todos = TODOS;

    saveTodos();
}

// === Create Data ===

function createTodo(title, dueDate) {
    const id = '' + new Date().getTime();            // create and fill the id field for this new entry (for now assign it to a temporary variable called id, and THEN we assign that to todos.id)

    // push those values we fetched to the todos object
    todos.push({
        title: title,
        dueDate: dueDate,
        id: id
    });

    saveTodos();
}


// === Delete Data ===

function removeTodo(idToDelete) {
    /*
    // done the suggested way
        todos = todos.filter(function(todo) {
            // if the of the todo item maches the id of the HTML elemenet ..
            if (todo.id === idToDelete) {
                return false;
            } else {
                return true;
            }
        });
    */

    // below is how I opted to do it
    todos = todos.filter(item => {
        return item.id !== idToDelete;
    });

    saveTodos();
}

// === Save and Retreive Data===

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}


function loadTodos() {
    // load the saved JSON file and convert it back into an object
    // do not update the todos yet, however - for now just save it to a variable
    const savedTodos = JSON.parse(localStorage.getItem('todos'));

    // check the loaded saved object whether it is indeed an array before updating the data: todos
    if (Array.isArray(savedTodos)) {
        todos = savedTodos;
    } else {
        todos = TODOS;
    }
}

// == VIEW SECTION ==

render();                                                           // render at the start


// the add-button
const addButton = document.getElementById('add-button');
const BUTTON_TEXT = 'Add ToDo';                                     // create a JS variable for the button text and fill the button with it
addButton.innerText = BUTTON_TEXT;

// the status bar
const statusBar = document.getElementById('status-bar');
const STATUS_TEXT = '-- Updates --';
statusBar.innerText = STATUS_TEXT;

// === The Render function, which includes creating new divs ===
// create the divs and fill them (this function is for display purposes and not actually updating any variables)
function render() {
    document.getElementById('todo-list').innerHTML = '';            // reset the list content div

    loadTodos();
    todos.forEach(todo => {                                         // traverse through the list to create and fill the divs
        const element = document.createElement('div');
        element.innerText = todo.title + '......' + todo.dueDate;   // add the todo title + some padding (dots) + the due date to the line div
        
        const deleteButton = document.createElement('button');      // create the delete button
        deleteButton.innerText = 'Delete';                          // .. and fill it with text
        deleteButton.className = "button";                          // assign to button class
        deleteButton.style = 'margin-left: 12px';                   // .. give it some padding (left margin)
        deleteButton.onclick = deleteToDo;                          // call the deleteToDo function
        deleteButton.id = todo.id;                                  // assign the delete button its id (we have already added an id in the database - now time to assign the same to the button HTML id so the two can be linked together this way)
        element.appendChild(deleteButton);                          // add the button to the line div

        const todoList = document.getElementById('todo-list');
        todoList.appendChild(element);                              // actually add the line div to the bigger todoList div
    })
}

// shortly display short-lived update
function displayShortLivedUpdate(statusSelected, titleAdded) {
    updateStatus(statusSelected, titleAdded);

    statusSelected = statusCats[0];
    setTimeout(() => {
        updateStatus(statusSelected, titleAdded); 
     }, 3000);
}

// update status bar based on selected status
function updateStatus(statusSelected, titleAdded) {
    if (statusSelected === statusCats[0]) {                 // default (display "Updates" in the field)
        statusBar.innerText = STATUS_TEXT;
    } else if (statusSelected === statusCats[1]) {          // add
        statusBar.innerText = `"${titleAdded}" added!`;
    } else if (statusSelected === statusCats[2]) {          // delete
        statusBar.innerText = `"${titleAdded}" deleted!`;
    } else if (statusSelected === statusCats[3]) {          // reset
        statusBar.innerText = 'To-do list reset!';
    } else {
        statusBar.innerText = 'Unexpected!';
    }
}

function cleanTextBox() {
    const textbox = document.getElementById('todo-title');
    textbox.value = '';
}

// == CONTROLLER SECTION ==

// the reset function
function resetOnClick() {
    resetTodos();
    render();

    displayShortLivedUpdate(statusCats[3]);
}

// the add function
function addToDo() {
    const textbox = document.getElementById('todo-title');
    const title = textbox.value;                // get the item name from the input text box
    
    const datePicker = document.getElementById('date-picker');
    const dueDate = datePicker.value;           // get the date from the date input field

    createTodo(title, dueDate);

    render();                                   // after we have already applied all the changes we want to the database, we "render" to update the view
    console.log(`${title} added!`);             // update in console
    displayShortLivedUpdate(statusCats[1], title);

    cleanTextBox();
}

// delete button function
function deleteToDo(event) {
    const deleteButton = event.target;
    const idToDelete = deleteButton.id;

    console.log(`Entry with ID # ${idToDelete} deleted!`);                           // for testing only and can be safely deleted any time

    // get the element that WAS deleted and save it into a variable; we're doing this to use it in notifications
    let deletedTodo = todos.filter(item => {
        return item.id === idToDelete;
    });
    console.log(`"${deletedTodo[0].title}" deleted!`);
    displayShortLivedUpdate(statusCats[2], deletedTodo[0].title);

    removeTodo(idToDelete);

    // after we have assigned the true and false values, we render the list again
    render();

    cleanTextBox();
}
