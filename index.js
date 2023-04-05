//Import the express.js framework
const express = require('express');
//Creating an Express application instance
const app = express();
//Setting port number for the process environment variable to 3000
const port = process.env.PORT || 3000;




const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});//Import is Used for parsing form data sent in the request body
const jsonParser = bodyParser.json();//Import Is used for parsing JSON data

const fileName = "toDoList.json";
const fs = require('fs');// The fs module is imported to read and write the ToDoList.json which is then stored in the data variable. 

let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

app.set('views', 'views');// These lines configure express app to use handlebars.js view engine
app.set('view engine', 'hbs');//The views setting specifies the directory where the template are located
app.use(express.static('public'));//The express.static() middleware function is used to serve static files from the public directory.


app.get("/", (req, res) => {//This route handler responds to HTTP GET requests to the root URL '/' by rendering the 'index'
    res.render('index', {tasks: data});//template and passing it a 'tasks' variable  containing the to-do list data
});


//Add task Functionality
// -> This route handler responds to HTTP POST  requests to the /add task URL by adding a new task
app.post("/addtask", urlEncodedParser, (req, res) => {
    // The new task is extracted from the request body using the 'urlEncoderParser' middleware
    var newTask = req.body.newtask;
    const taskObject = {
        //new task object is created with a unique ID
        ID: Date.now() + Math.random().toString(36).substr(2, 9),
        Task: newTask,//Name of the new task
        Completed: false//This completed flag set to "False" by default

    };
    data.push(taskObject);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    res.redirect("/"); //The server sends an HTTP resdirect response back to the client, then reloads the page
});
// End Add task Functionality

//Start markCompleted Functionality

// Handle POST requests to mark a task as completed
app.post("/markcompleted", urlEncodedParser, (req, res) => {
    //Extract the completed task IDs from the request body

    let completedTasksId = req.body.completedtasks;
    if (completedTasksId) {
        //Ensure that completedTaskIDs is an array 
        if (!Array.isArray(completedTasksId)) {
            completedTasksId = [completedTasksId];
        }

        // Mark the tasks as completed in the data array
        for (const task of data) {
            if (completedTasksId.includes(task.ID)) {
                task.Completed = true;
            }
        }
        //Write the updated data to the file
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    } 
    // Redirect the client back to the root URL
    res.redirect("/");
   
});
//End markCompleted Functionality

//Delete task Fuctionality start

// Handle POST requests to delete a task
app.post("/deletetask", urlEncodedParser, (req, res) => {

    //Extract the task ID to delete from the request body
    const taskID = req.body.taskID;

    // Filter the task with the specified ID out of the data array
    data = data.filter(task => task.ID !== taskID);

    // Write the updated data to the file
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

    // Redirect the client back to the root URL
    res.redirect("/");
    
});


// Start the server
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
