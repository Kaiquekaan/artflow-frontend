import React from 'react'

const Doing = ({doin, removeDoing, completeDoing}) => {
    return (
        
      <div className="todo" style={{textDecoration: doin.isCompleted ? "line-through": ""}}>
      <div className="content">
        <p>{doin.title}</p>
        <p className="category">
          ({doin.category})
        </p>
        <button className='complete' onClick= {() => completeDoing(doin.id)}>Completar</button>
        <button className='remove' onClick= {() => removeDoing(doin.id)} >
          x
          </button>
      </div>
    </div>
    )
  }

export default Doing