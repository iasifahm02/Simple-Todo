import React, { useState } from 'react'
import './App.css'

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [todos, setTodos] = React.useState([]);

  //Post/save the new Todo Item
  const addTodo = () => {
    if (!title || !description) {
      alert("Please enter the todo!");
      return;
    }

    //fetch Api to add new todo
    fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        username: "aaasifsays",
        password: "123456"
      },
      body: JSON.stringify({ title, description })
    })
      .then((response) => {
        return response.json();
      })
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        setTitle('');
        setDescription('');
      })
  }

  //Delete the Todo Item
  const deleteTodo = (id) => {
    //Fetch Api to delete the todo..
    fetch("http://localhost:3000/todos/" + id, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        username: "aaasifsays",
        password: "123456"
      }
    }).then((response) => {
      return response.json();
    }).then((todo) => {
      console.log(todo);
      setTodos(todos.filter(todo => todo.id !== id));
    })
  }

  //Get all Todos
  React.useEffect(() => {
    fetch("http://localhost:3000/todos", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        username: "aaasifsays",
        password: "123456"
      }
    }).then((response) => {
      return response.json();
    }).then((todos) => {
      setTodos(todos);
    })
  }, []);

  return (
    <>
      <h1>My Todo App</h1>
      Title: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /> <nbsp />
      Description: <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /> <nbsp />
      <button onClick={addTodo}>send</button>
      <br /> <br />
      {todos.map((todo) => {
        return <div>
          <Todo title={todo.title} description={todo.description} onDelete={() => deleteTodo(todo.id)} />
        </div>
      })}
    </>
  )
}

function Todo(props) {
  return <div>
    <strong>{props.title}: </strong>{props.description} <nbsp />
    <button onClick={props.onDelete}>delete</button>
    <br />
  </div>
}

export default App
