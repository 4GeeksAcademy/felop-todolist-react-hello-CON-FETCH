import React, { useState } from 'react';



const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  
  const addTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

 
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  
  const removeTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  
  const remainingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className='body'>
      <div className="lista">
        <h1>To-Do List</h1>


        <div className="todo-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task"
          />
          <button onClick={addTask}>Add</button>
        </div>


        <ul className="todo-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`todo-item ${task.completed ? 'completed' : ''}`}
            >
              <span
                className="todo-text"
                onClick={() => toggleTaskCompletion(task.id)}
              >
                {task.text}
              </span>

              <button
                className="remove-btn"
                onClick={() => removeTask(task.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>


        {remainingTasks > 0 ? (
          <p className="tasks-left">{remainingTasks} tasks left</p>
        ) : (
          <p className="no-tasks-message">No hay tareas, añadir tareas</p>
        )}
      </div>
    </div>
  );
};

export default Home;
