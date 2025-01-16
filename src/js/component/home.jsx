import React, { useState,useEffect } from 'react';



const Home = () => {
 const apiUrl = "https://playground.4geeks.com/todo"

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [userName, setUserName] = useState("");
  const [turn, setTurn] = useState(false);


  const addTask = () => {
    if (newTask.trim() === '') return;
   createTask( { label: newTask, is_done: false })
    setNewTask('');
  };

  
  


  const toggleTaskCompletion = (index) => {
    const updatedTasks= tasks.map((task,i)=>
      i===index?{...task,done: !task.done}:task
  );
  setTasks(updatedTasks);
  syncTasks(updatedTasks);
  };




  


  const handlerGetList = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.error("Usuario no encontrado.");
          alert("El usuario no existe. Intenta con otro nombre.");
        } else {
          console.error("Error del servidor:", response.status);
        }
        return;
      }
  
      const data = await response.json();
      console.log("Datos recibidos:", data);
  
      // Si los datos son válidos, actualiza las tareas
      if(Array.isArray(data.todos)){ 
      setTasks(data.todos);
    }else{ 
      console.error("el formato de datos no es valido:",data);
    }
    }catch (error) {
      console.error("Error al obtener las tareas:", error);
      setTasks([]);
    }
  };
  const handlerSearch = async () => {
    try {
      if (userName.trim().length <2){ 
        alert("Metele mas manito")
        return
      }
      const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`);
    
    if (response.status === 404) {
      // Si el usuario no existe, lo creamos
      console.log("Usuario no encontrado. Creando usuario...");
      await createUser(userName);
    }

      setTurn(( prev)=>!prev);
    } catch (error) {
      console.error("Error al buscar o crear usuario:", error);
    }
  };
  
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: "DELETE",
        
      });
      if (!response.ok) throw new Error("Error al sincronizar tareas");
      setTasks( tasks.filter((item ) => item.id !== id))
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAllTasks = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/${userName}`, {
        method: "DELETE",
        
      });
      if (!response.ok) throw new Error("Error al sincronizar tareas");
      setTasks([])
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async (newTask) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${userName}`, {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error agregar nueva tarea");
      setTasks(tasks.concat(newTask))
      return true
    } catch (error) {
      console.error(error);
    }
  };

  const createUser = async (name) => {
    try {
      const response = await fetch(`${apiUrl}/users/${userName}`, {
        method: "POST",
        
        
      });
      if (!response.ok) throw new Error("Error al crear usuario ");
       
      return true
    } catch (error) {
      console.error(error);
    }
  };

  


  useEffect(() => {
    handlerGetList()
  }, [turn]);

return (
  <div className='body'>
    <div className="lista">
      <h1>To-Do List</h1>

      <input type="text" id='usuario' placeholder='Escribe tu usuario aca ' value={userName}onChange={(e) => setUserName(e.target.value)}/>
      <button className='boton' onClick={handlerSearch}>Buscar</button>

      <div className="todo-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add</button>
      </div>


      <ul className="todo-list">
        {tasks.map((task,index) => (
          <li
            key={index}
            className={`todo-item ${task.done ? 'completed' : ''}`}
          >
            <span
              className="todo-text"
              onClick={() => toggleTaskCompletion(index)}
            >
              {task.label}
            </span>

            <button
              className="remove-btn"
              onClick={() => deleteTask(task.id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>


      {tasks.length > 0 ? ( 
        <p className="tasks-left">{tasks.filter((task) => !task.done).length}tasks left</p>
      ) : (
        <p className="no-tasks-message">No hay tareas, añadir tareas</p>
      )}
       <button onClick={deleteAllTasks} className="clear-btn">
          Limpiar todas las tareas
        </button>
    </div>
  </div>
);
};

export default Home;
