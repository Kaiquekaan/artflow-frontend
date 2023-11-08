import React from 'react'


const Todo = ({todo, removeTodo, completeTodo}) => {
  return (
    
    <div className="todo" style={{textDecoration: todo.isCompleted ? "line-through": ""}}>
    <div className="content">
      <p>{todo.title}</p>
      <p>{todo.desc}</p>
      <p className="category">
        ({todo.category})
      </p>
      <button className='complete' onClick= {() => completeTodo(todo.id)}>Completar</button>
      <button className='remove' onClick= {() => removeTodo(todo.id)} >
        x
        </button>
    </div>
  </div>
  )
}

export default Todo