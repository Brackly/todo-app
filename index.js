const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
const fileName = "toDoList.json";
const fs = require('fs');

let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render('index', {tasks: data});
});

app.get("/healthcheck", (req, res) => {
    res.sendStatus(200);
});

app.post("/addtask", urlEncodedParser, (req, res) => {
    var newTask = req.body.newtask;
    console.log(newTask)
    if(!newTask) return res.status(400).redirect('/')
    try{
        const taskObject = {
            ID: Date.now() + Math.random().toString(36).substring(2, 9),
            Task: newTask,
            Completed: false
        };
        data.push(taskObject);
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    }catch(err){
        console.log(err)
    }
    res.redirect("/");
});

app.post("/markcompleted", urlEncodedParser, (req, res) => {
    let completedTasksId = req.body.completedtasks;
    if (completedTasksId) {
        if (!Array.isArray(completedTasksId)) {
            completedTasksId = [completedTasksId];
        }
        for (const task of data) {
            if (completedTasksId.includes(task.ID)) {
                task.Completed = true;
            }
        }
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    }
    res.redirect("/");
});

app.post("/deletetask", urlEncodedParser, (req, res) => {
    const taskID = req.body.taskID;
    data = data.filter(task => task.ID !== taskID);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    res.redirect("/");
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
