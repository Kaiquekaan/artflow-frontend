import { useState} from 'react'

const TodoForm = ({addTodo}) => {
    const[value, setValue] = useState("")
    const[category, setCategory] = useState ("")
    const[desc, setDesc] = useState ("")

    const handleSubmit= (e) =>{
         e.preventDefault();
         if(!value || !category || !desc) return;
         addTodo(value,category, desc)
         setDesc("");
         setValue("");
         setCategory("");
    }

  return (
    <div className='todo-form'>
        
        <form onSubmit={handleSubmit}>
            <p>Nome da tarefa:</p>
            <input type="text" className='input-titulo' value= {value} placeholder='Digite o titulo' onChange={(e)=> setValue(e.target.value)}/>
            <p>Descrição:</p>
            <textarea className='input-desc' value={desc} placeholder='Digite a descrição' onChange={(e) => setDesc(e.target.value)} />

            <select value= {category}  onChange={(e)=> setCategory(e.target.value)}>
                <option value="">Selecione uma categoria</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Estudo">Estudo</option>
            </select>
            <button type="submit">Criar tarefa</button>
        </form>
    </div>
  )
}

export default TodoForm