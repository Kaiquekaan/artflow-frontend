import React from 'react'

const Doing = ({doing, removeDoing, completeDoing}) => {
    return (
        
      <div className="todo" style={{textDecoration: doing.isCompleted ? "line-through": ""}}>
      <div className="content">
        <p>{doing.title}</p>
        <p className="category">
          ({doing.category})
        </p>
        <button className='complete' onClick= {() => completeDoing(doing.id)}>Completar</button>
        <button className='remove' onClick= {() => removeDoing(doing.id)} >
          x
          </button>
      </div>
    </div>
    )
  }

export default Doing