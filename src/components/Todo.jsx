import React from 'react'


const Todo = ({todo, removeTodo, completeTodo, onClick, isDelayed}) => {

  const today = new Date();
  const dueDate = new Date(todo.date);
  const difference = dueDate.getTime() - today.getTime();

  const daysLeft = Math.floor(Math.abs(difference) / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(Math.abs(difference) / (1000 * 60 * 60));
  const minutesLeft = Math.floor(Math.abs(difference) / (1000 * 60));

  let timeLeft = '';

  if (daysLeft > 0) {
    const weeksLeft = Math.floor(daysLeft / 7);
    const monthsLeft = Math.floor(daysLeft / 30);

    if (monthsLeft > 0) {
      timeLeft = `${monthsLeft} ${monthsLeft === 1 ? 'mês' : 'meses'}`;
    } else if (weeksLeft > 0) {
      timeLeft = `${weeksLeft} ${weeksLeft === 1 ? 'semana' : 'semanas'}`;
    } else {
      timeLeft = `${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}`;
    }
  } else if (hoursLeft > 0) {
    timeLeft = `${hoursLeft} ${hoursLeft === 1 ? 'hora' : 'horas'}`;
  } else {
    timeLeft = `${minutesLeft} ${minutesLeft === 1 ? 'minuto' : 'minutos'}`;
  }

  const isDelayedTerm = difference < 0;



  return (
    
    <div className={`todo ${isDelayed ? 'task-atrasada' : ''}`} style={{textDecoration: todo.isCompleted ? "line-through": ""}} title="Clique para visualizar detalhes ou editar a tarefa">
    <div className="content-todo" key={todo.id}>
      <div className='task-click' onClick={onClick}>
      <p>{todo.title}</p>
      <p className="category" >
      <p>{isDelayedTerm ? `Atrasada há ${timeLeft}` : `Falta ${timeLeft}`}</p>
        ({todo.category})
      </p>
      </div>
      <div className='div-buttons'>
      <button className='complete-todo' onClick= {() => completeTodo(todo.id)}>Completar</button>
      <button className='remove-todo' onClick= {() => removeTodo(todo.id)} >
        x
        </button>
        </div>
    </div>
  </div>
  )
}

export default Todo