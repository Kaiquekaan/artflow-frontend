import React from 'react'
import { useState, useEffect } from 'react'
import { auth, db } from '../firebase'; 
import Todo from './Todo'
import TodoForm from './TodoFrom'
import Done from './Done'
import { useTaskContext } from '../services/TaskContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark} from '@fortawesome/free-solid-svg-icons';
import { startOfDay, isBefore, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isAfter, format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

function Task({atualizarPorcentagem, filtro , setFiltro}) {
    const user = auth.currentUser;
    const [selectedTask, setSelectedTask] = useState(null);
    const [tarefasDoDia, setTarefasDoDia] = useState([]);
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingDescription, setEditingDescription] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);


    const { tasks, updateTasks } = useTaskContext();

    const [todos, setTodos] = useState([])


    const [dones, setDones] = useState([])

   useEffect(() => { 
    const tasksCollectionRef = db.collection('tasks');
    const todosCollectionRef = tasksCollectionRef.doc(user.uid).collection('todos');
    const donesCollectionRef = tasksCollectionRef.doc(user.uid).collection('dones');
  
    todosCollectionRef.get()
    .then((querySnapshot) => {
      const todos = [];
      querySnapshot.forEach((doc) => {
        todos.push({
          id: doc.id,
          category: doc.data().category,
          title: doc.data().title,
          description: doc.data().description,
          user: doc.data().user,
          date: doc.data().date, // Use a data real do documento
        });
      });
      updateTasks(todos);
      setTodos(todos);
    })
    .catch((error) => {
      console.error('Erro ao obter todos do usuário: ', error);
    });

    const hoje = new Date().toISOString().split('T')[0]; // Obtém a data atual no formato 'YYYY-MM-DD'

    const tarefasDoDiaFiltradas = todos.filter((todo) => todo.date.split('T')[0] === hoje);
    setTarefasDoDia(tarefasDoDiaFiltradas);

   

      donesCollectionRef.get()
      .then((querySnapshot) => {
        const dones = [];
        querySnapshot.forEach((doc) => {
          dones.push({
            id: doc.id,
            category: doc.data().category,
            title: doc.data().title,
            description: doc.data().description,
            user: doc.data().user,
            date: doc.data().date, // Use a data real do documento
          });
        });
        setDones(dones);
      })
      .catch((error) => {
        console.error('Erro ao obter todos do usuário: ', error);
      });


     



   }, []);
  

   useEffect(() => { 
    setTodos(tasks); 
    const hoje = new Date().toISOString().split('T')[0]; // Obtém a data atual no formato 'YYYY-MM-DD'

    const tarefasDoDiaFiltradas = todos.filter((todo) => todo.date.split('T')[0] === hoje);
    setTarefasDoDia(tarefasDoDiaFiltradas);
    }, [tasks]);
    

    
  
    const addTodo = (title, category, desc) => {
      const newTodo = {
        title,
        category,
        description: desc,
        user: user.uid,
        date: new Date().toISOString(), // Use a data atual
      };
    
      // Adicione a nova tarefa ao estado local
      setTodos([...todos, newTodo]);
    
      // Adicione a nova tarefa ao Firestore
      todosCollectionRef.add(newTodo)
        .then((docRef) => {
          console.log('Tarefa adicionada com sucesso com ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Erro ao adicionar tarefa: ', error);
        });
    };
    
    const completeTask = async (id, sourceCollectionRef, targetCollectionRef) => {
      try {
    
        const sourceDocRef = sourceCollectionRef.doc(id);
        const doc = await sourceDocRef.get();
    
        if (doc.exists) {
    
          const taskData = doc.data();
    
          await targetCollectionRef.doc(id).set(taskData);
          await sourceDocRef.delete();
    
    
          // Após completar a tarefa, chame a função fetchData para obter os dados mais recentes
          fetchData();
        } else {
          console.error('Task not found in the source collection.');
        }
      } catch (error) {
        console.error('Error completing task:', error);
      }
    };
    
    const fetchData = () => {
    const tasksCollectionRef = db.collection('tasks');
    const todosCollectionRef = tasksCollectionRef.doc(user.uid).collection('todos');
    const donesCollectionRef = tasksCollectionRef.doc(user.uid).collection('dones'); 
      // Coloque aqui o código para buscar os dados mais recentes do Firestore
      // e atualizar os estados locais (setTodos, setDoings, setDones)
      // Pode ser semelhante ao código que está atualmente no useEffect.
      // ...
    
      // Exemplo (certifique-se de adaptar conforme sua estrutura de dados):
      todosCollectionRef.get()
        .then((querySnapshot) => {
          const todos = [];
          querySnapshot.forEach((doc) => {
            todos.push({
              id: doc.id,
              category: doc.data().category,
              title: doc.data().title,
              description: doc.data().description,
              user: doc.data().user,
              date: doc.data().date,
            });
          });
          setTodos(todos);
          updateTasks(todos);
        })
        .catch((error) => {
          console.error('Erro ao obter todos do usuário: ', error);
        });

  
        donesCollectionRef.get()
        .then((querySnapshot) => {
          const dones = [];
          querySnapshot.forEach((doc) => {
            dones.push({
              id: doc.id,
              category: doc.data().category,
              title: doc.data().title,
              description: doc.data().description,
              user: doc.data().user,
              date: doc.data().date, // Use a data real do documento
            });
          });
          setDones(dones);
        })
        .catch((error) => {
          console.error('Erro ao obter todos do usuário: ', error);
        });


    };
    
    const completeTodo = (id) => {
      const tasksCollectionRef = db.collection('tasks');
      const todosCollectionRef = tasksCollectionRef.doc(user.uid).collection('todos');
      const donesCollectionRef = tasksCollectionRef.doc(user.uid).collection('dones');
      completeTask(id, todosCollectionRef, donesCollectionRef);
    };
    
    
    
    
    
    
    
    const removeTask = (id, collectionRef, setLocalState) => {
      // Remova a tarefa da coleção no banco de dados
      collectionRef.doc(id).delete()
        .then(() => {
          console.log('Tarefa removida com sucesso.');
        })
        .catch((error) => {
          console.error('Erro ao remover tarefa: ', error);
        });
    
      // Remova a tarefa do estado local
      setLocalState((prevState) => prevState.filter((task) => task.id !== id));
      fetchData();
    };
    
    const removeTodo = (id) => {
      const todosCollectionRef = db.collection('tasks').doc(user.uid).collection('todos');
      removeTask(id, todosCollectionRef, setTodos);
    };
    
    const removeDone = (id) => {
      const donesCollectionRef = db.collection('tasks').doc(user.uid).collection('dones');
      removeTask(id, donesCollectionRef, setDones);
    };


    const calcularPorcentagem = () => {
      const tamanhoTotal = todos.length + dones.length;
      const novaPorcentagem = (dones.length / tamanhoTotal) * 100;
      const porcentagemFormatada = novaPorcentagem.toFixed(2);
      atualizarPorcentagem(parseFloat(porcentagemFormatada));// Chamando a função do componente pai
    };
    

    useEffect(() => {
      calcularPorcentagem();
    }, [todos, dones, atualizarPorcentagem]);


    const handleTaskClick = (task) => {
      setSelectedTask(task); // Define a tarefa selecionada quando o usuário clica nela
    };

    const closeTaskDetails = () => {
      if (hasChanges) {
        setShowConfirmation(true); // Mostra a div de confirmação se houver mudanças pendentes
      } else {
        setSelectedTask(null); // Fecha os detalhes da tarefa se não houver mudanças pendentes
      }
    };
  


    const isTaskDelayed = (taskDate) => {
      const today = new Date();
      const taskDateObj = new Date(taskDate);
      
      // Verifica se a data da tarefa é anterior à data atual, considerando apenas o dia
      return isBefore(taskDateObj, startOfDay(today));
    };
    
    const filterTasks = (tasks) => {

      const brazilTimeZone = 'America/Sao_Paulo'; // Fuso horário do Brasil (exemplo: horário de Brasília)
      const today = new Date(); // Data atual local

      switch (filtro) {
        case 'day':
      const todayInBrazilTimeZone = utcToZonedTime(today, brazilTimeZone); // Convertendo a data atual para o fuso horário do Brasil
      const todayISO = format(todayInBrazilTimeZone, 'yyyy-MM-dd'); // Formatando a data para comparar com o formato das datas do banco de dados

      return tasks.filter((task) => {
        const taskDate = parseISO(task.date); // Convertendo a data da tarefa para um objeto Date
        const taskDateInBrazilTimeZone = utcToZonedTime(taskDate, brazilTimeZone); // Convertendo a data da tarefa para o fuso horário do Brasil
        const taskISO = format(taskDateInBrazilTimeZone, 'yyyy-MM-dd'); // Formatando a data da tarefa para comparar com o formato das datas do banco de dados

        return taskISO === todayISO; // Comparando apenas as partes de data (ignorando horários)
      });
        case 'delayed':
          return tasks.filter((task) => isTaskDelayed(task.date));
    
        case 'week':
          const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 0 }); // Domingo como início da semana
          const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 0 });
    
          return tasks.filter((task) => {
            const taskDate = new Date(task.date);
            return isAfter(taskDate, startOfWeekDate) && isBefore(taskDate, endOfWeekDate);
          });
    
        case 'month':
          const startOfMonthDate = startOfMonth(new Date());
          const endOfMonthDate = endOfMonth(new Date());
    
          return tasks.filter((task) => {
            const taskDate = new Date(task.date);
            return isAfter(taskDate, startOfMonthDate) && isBefore(taskDate, endOfMonthDate);
          });
    
        default:
          return tasks;
      }
    };
    

    const filteredTasks = filterTasks(tasks);


   
    const [editedTitle, setEditedTitle] = useState(selectedTask ? selectedTask.title : '');
    const [editedDescription, setEditedDescription] = useState(selectedTask ? selectedTask.description : '');
   const [hasChanges, setHasChanges] = useState(false);

    const handleTitleChange = (value) => {
      setEditedTitle(value);
      setHasChanges(true); // Indica que houve uma alteração no título
    };
    
    const handleDescriptionChange = (value) => {
      setEditedDescription(value);
      setHasChanges(true); // Indica que houve uma alteração na descrição
    };


    const handleTitleClick = () => {
      setEditingTitle(true); // Ativa o modo de edição do título
      setEditedTitle(selectedTask.title); // Define o valor atual do título no estado de edição
    };

    const handleDescriptionClick = () => {
      setEditingDescription(true); // Ativa o modo de edição da descrição
      setEditedDescription(selectedTask.description); // Define o valor atual da descrição no estado de edição
    };
    
    const confirmEdit = (field) => {
      if (field === 'title') {
        if (editedTitle !== '') {
          setSelectedTask({ ...selectedTask, title: editedTitle });
          setEditingTitle(false);
          setHasChanges(true);
        }
      } else if (field === 'description') {
        if (editedDescription !== '') {
          setSelectedTask({ ...selectedTask, description: editedDescription });
          setEditingDescription(false);
          setHasChanges(true);
        }
      }
    };
    
    

    const handleKeyPress = (event, field) => {
      if (event.key === 'Enter') {
        confirmEdit(field);
      }
    };

    const handleConfirmation = async (confirm) => {
      if (confirm) {
        const updatedTask = {
          title: editedTitle !== '' ? editedTitle : selectedTask.title,
          description: editedDescription !== '' ? editedDescription : selectedTask.description,
        };
    
        try {
          await db
            .collection('tasks')
            .doc(user.uid)
            .collection('todos')
            .doc(selectedTask.id)
            .update(updatedTask);
    
          setSelectedTask({ ...selectedTask, ...updatedTask });
          setEditingTitle(false);
          setEditingDescription(false);
          setHasChanges(false);
          setShowConfirmation(false);
          setSelectedTask(null); // Aqui fecha o painel de detalhes após a confirmação
          fetchData();
        } catch (error) {
          console.error('Erro ao atualizar tarefa:', error);
        }
      } else {
        setEditedTitle(selectedTask.title);
        setEditedDescription(selectedTask.description);
        setSelectedTask(null);
        setShowConfirmation(false);
      }
    };
    
    
  
    
  
    return <div className="task">

       <div className="card-container">
          <div className="card card-tarefa card-todo">
          <div className="card-body">
                <h5 className="card-title">Tarefas</h5>
                <div className="todo-list">
                {filteredTasks.map((todo) => (
        <Todo key={todo.id} todo={todo} removeTodo={removeTodo} completeTodo={completeTodo} onClick={() => handleTaskClick(todo)} isDelayed={isTaskDelayed(todo.date)} // Adiciona a classe condicionalmente
        />
      ))}
      </div>
      </div> 
      
      </div>
            <div className="card card-tarefa">
            <div className="card-body card-done">
                <h5 className="card-title">Concluídas</h5>
                <div className="todo-list">
        {dones.map((done) => (
         <Done key={done.id} done = {done} removeDone={removeDone} onClick={() => handleTaskClick(done)}/>
        ))}
      </div>
      
      </div> 
                           </div>
                           {selectedTask && (
       <div className="page">
       <div className='page-overlay'></div>
     <div className='task-details '>
      <button className='close-button' onClick={closeTaskDetails}><FontAwesomeIcon icon={faXmark} /></button>
       <div className='details-header'>
       <h2>Detalhes da Tarefa</h2>
       </div>
       <div className='details-title' onClick={handleTitleClick}>
      <p>Título: {editingTitle ? <input type="text" value={editedTitle}  onKeyPress={(e) => handleKeyPress(e, 'title')} onChange={(e) => handleTitleChange(e.target.value)} /> : selectedTask.title}</p>
      {editingTitle}
      </div>
      <div className='details-desc' onClick={handleDescriptionClick}>
  <p>Descrição: {editingDescription ? <textarea value={editedDescription} onKeyPress={(e) => handleKeyPress(e, 'description')}  onChange={(e) => handleDescriptionChange(e.target.value)} /> : selectedTask.description}</p>
  {editingDescription}
</div>

    <div className='details-date'>
   <p >Data: {selectedTask.date}</p>
    </div>
       
     </div>
     {showConfirmation && (
        <div className="confirmation-dialog">
          <p className='confirmation-title'>Deseja salvar as alterações?</p>
          <div className="confirmation-buttons">
            <button className='btn-confirm' onClick={() => handleConfirmation(true)}>Confirmar</button>
            <button onClick={() => handleConfirmation(false)}>Cancelar</button>
          </div>
        </div>
      )}
     

     </div>
      )}
                           
                           </div>
      
        
    </div>;
  }

export default Task