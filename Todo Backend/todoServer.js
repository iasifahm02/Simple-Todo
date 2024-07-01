const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json()); //middleware
app.use(cors()); //No CORS error

// const todos = [];

const userAuthentication = (req, res, next) =>{
    const{username, password} = req.headers;
    fs.readFile("users.json", (err, users)=>{
        if(err) throw err;

        users = JSON.parse(users);
        const user = users.find(u => u.username === username && u.password === password);
        if(user){
            req.user = user;
            next();
        }
        else{
            res.status(404).json({message: "User authentication failed"});
        }
    })
}

//Task 1 - Get all todos
app.get("/todos", userAuthentication, (req, res)=>{
    fs.readFile("todos.json", "utf-8", (err, data)=>{
        if(err) throw err;
        data = JSON.parse(data); //convert Stringify data into JSON
        res.status(200).json(data);
    })
});

//Task 2 - Create new todo
app.post("/todos", userAuthentication, (req, res)=>{
    const id = Math.floor(Math.random()*1000);
    const newTodo = {id, ...req.body};
    fs.readFile("todos.json", "utf-8", (err, data)=>{
        if(err) throw err;

        data = JSON.parse(data);
        data.push(newTodo);
        //Write the newTodo
        fs.writeFile("todos.json", JSON.stringify(data),(err)=>{
            if(err) throw err;
            res.status(201).json(newTodo);
        });

    })
});

//Task 3 - Update the todo
app.put("/todos/:id", userAuthentication, (req, res)=>{
    const id = parseInt(req.params.id);
    fs.readFile("todos.json", "utf-8", (err, todos)=>{
        if(err) throw err;

        todos = JSON.parse(todos);
        const todoIndex = todos.findIndex((todo) => todo.id === id);
        if(todoIndex === -1){
            //todo not found
            return res.status(404).json({message: "Todo Not found!"});
        }
        else{
            Object.assign(todos[todoIndex], req.body);
            fs.writeFile("todos.json", JSON.stringify(todos), (err)=>{
                if(err) throw err;
                res.status(200).json(todos[todoIndex]);
            })
        }
    })
});

//Task 4 - Delete the todo
app.delete("/todos/:id", userAuthentication, (req, res)=>{
    fs.readFile("todos.json", "utf-8", (err, todos)=>{
        if(err) throw err;

        todos = JSON.parse(todos);
        const todoIndex = todos.findIndex((todo) => todo.id === parseInt(req.params.id));
        if(todoIndex === -1){
            //todo not found
            res.status(404).json({message: "Todo not found"});
        }
        else{
            todos.splice(todoIndex, 1); // delete the todo
            //Save changes in file
            fs.writeFile("todos.json", JSON.stringify(todos), (err)=>{
                if(err) throw err;
                res.json({message: "Todo deleted successfully"});
            })
        }
    })
});

//Task 5: User registration
app.get("/signup", (req, res)=>{
    const username = req.headers.username;
    const password = req.headers.password;
    console.log(username, password);
    fs.readFile("users.json", (err, users)=>{
        if(err) throw err;

        users = JSON.parse(users);
        const userFind = users.findIndex(u => u.username === username && u.password === password);
        if(userFind !== -1){
            res.status(404).json({message: "User already exist!"});
            return;
        }

        users.push({username, password});
        fs.writeFile("users.json", JSON.stringify(users), (err)=>{
            if(err) throw err;
            res.json({message: "User registered successfully"});
        })
    })
})

//Task 6: User Login
app.get("/login", userAuthentication, (req, res)=>{
    res.json({message: "User login successfully"});
})

app.listen(3000, ()=>{
    console.log("Server is listening on port 3000!");
});
