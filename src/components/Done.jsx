import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble} from '@fortawesome/free-solid-svg-icons';
import { faTrash} from '@fortawesome/free-solid-svg-icons';


const Done = ({done, removeDone, onClick}) => {
    return (
      <div className="done" style={{textDecoration: done.isCompleted ? "line-through": ""}} >
      <div className="content-done">
        <div className="task-click" onClick={onClick}>
        <div className='donetask'>
        <FontAwesomeIcon icon={faCheckDouble} style={{color: "#5cb85c",}} />
        <p className='donetask-title'>{done.title}</p>
        </div>
        <p className="category">
          ({done.category})
        </p>
        </div>
        <div>
        <button className='remove' onClick= {() => removeDone(done.id)} >
        <FontAwesomeIcon icon={faTrash} />
          </button>
          </div>
      </div>
    </div>
    )
  }

export default Done