// Making sure we can run everything when the document loads.
$(document).ready(onReady);

function onReady() {
    // These tie into making a GET and POST request.
    // This is important when we handle an event handler when we click on the button to add a task on our application
    // and render to the DOM.
    renderTasks();
    $('#createTask').on('click', addTask);
    // We need to create an event handler to delete a task in our list after the document loads:
    $('#tasksTableBody').on('click', '.delete-button', deleteTask)
    // We need to create an event handler to check-off/complete a task in our list after the document loads (updated this psuedocode):
    $('#tasksTableBody').on('click', '.complete-button', updateTask)

}

// Making a GET request.
// If the response is successful,
// the server will send a response to the client
// and append every task submitted.
function renderTasks() {
    $.ajax({
        type: 'GET',
        url: '/tasks'
    }).then((response) => {
        $("#tasksTableBody").empty();
        console.log('GET /tasks response', response);
        for(let task of response) {
            // We need to make sure we append code to ensure the task can be deleted based on its id.
            // We also need to make an if/else statement to toggle the 'marked complete' color when checkmarked.
            if(task.completed === true){
                $('#tasksTableBody').append(`<tr class="${task.id}"><td>${task.task}</td></tr>`)
                $(`.${task.id}`).addClass('addSomeGreen')
                $(`.${task.id}`).append(`
                    <td><input type="checkbox"class="complete-button" data-id="${task.id}" data-completed="${task.completed}" checked></td>
                    <td><button class="delete-button" data-id="${task.id}">Delete</button></td>
                `)
            } else if(task.completed === false){
                $('#tasksTableBody').append(`<tr class="${task.id}"><td>${task.task}</td></tr>`)
                $(`.${task.id}`).addClass('addSomeGrey')
                $(`.${task.id}`).append(`
                    <td><input type="checkbox"class="complete-button" data-id="${task.id}" data-completed="${task.completed}"></td>
                    <td><button class="delete-button" data-id="${task.id}">Delete</button></td>
                `)
            }
        };
    })
}

// Make a POST request to store data in my server.
// If it's successful,
// then we want to update our DOM with the new data
// by calling the renderTasks function.
function addTask() {
    const newTask = {
        task: $('#task').val()
    }
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: newTask
    }).then((response) => {
        console.log('POST /tasks success!');
        $('#task').val('')
        renderTasks();
    });
}

// Making a DELETE request
// If we want to delete a task on our list after the page loads
// We need to make sure we are targetting that specific task with the help of its id number.
// When this request is successful,
// We want to update our DOM by removing the task,
// making sure it's deleted from the data base
// and re-render the DOM.
function deleteTask() {
    const taskIdToDelete = $(this).data('id');
    $.ajax({
        type: 'DELETE',
        url: `/tasks/${taskIdToDelete}`
    }).then((response) => {
        console.log(response);
        renderTasks();
    })
}

// Making a PUT request for updating task
// If we want to UPDATE a task on our list after the page loads
// We need to make sure we are targetting that specific task with the help of its id number.
// When this request is successful,
// We want to update our DOM by UPDATING the task with the specific changes requested,
// making sure it's also updated on the data base
// and re-render the DOM.
function updateTask() {
    const taskID = $(this).data('id');
    let completedTask = $(this).data('completed');
    completedTask = true;
    console.log('taskID', taskID);
    console.log('completedTask', completedTask);
    $.ajax({
        type: 'PUT',
        url: `/tasks/complete/${taskID}`,
        data: {completedTask: completedTask}
    }).then((res) => {
        renderTasks();
    }).catch((err) => {
        console.log(err);
    })
}
