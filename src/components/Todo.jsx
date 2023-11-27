import React from 'react'


const Todo = ({todo, removeTodo, completeTodo, onClick, isDelayed}) => {




  return (
    
    <div className={`todo ${isDelayed ? 'task-atrasada' : ''}`} style={{textDecoration: todo.isCompleted ? "line-through": ""}} title="Clique para visualizar detalhes ou editar a tarefa">
    <div className="content-todo" key={todo.id}>
      <div className='task-click' onClick={onClick}>
      <p>{todo.title}</p>
      <p>{todo.desc}</p>
      <p className="category" >
        ({todo.category})
      </p>
      </div>
      <div>
      <button className='complete-todo' onClick= {() => completeTodo(todo.id)}>Fazer</button>
      <button className='remove-todo' onClick= {() => removeTodo(todo.id)} >
        x
        </button>
        </div>
    </div>
  </div>
  )
}

export default Todo