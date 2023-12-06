import { useState} from 'react'

const TodoForm = ({addTodo, selectedDate}) => {
    const[value, setValue] = useState("")
    const[category, setCategory] = useState ("")
    const[desc, setDesc] = useState ("")
    const [time, setTime] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!value || !category || !desc || !time.trim()) return;

      const [hour, minute] = time.split(':').map(Number);
      if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        console.error('Hora inválida:', time);
        return;
      }
  
       const currentDate = selectedDate || new Date(); // Use a data atual se não houver nenhuma data selecionada
        const selectedTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hour,
      minute
  );
  const isoFormattedDate = selectedTime.toISOString();

      addTodo(value, category, desc, isoFormattedDate);
  
      // Limpe os campos após adicionar a tarefa
      setDesc('');
      setValue('');
      setCategory('');
      setTime('');
    };

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
            <div>
          <p>Horário:</p>
          <input type='time' value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
            <button type="submit">Criar tarefa</button>
        </form>
    </div>
  )
}

export default TodoForm