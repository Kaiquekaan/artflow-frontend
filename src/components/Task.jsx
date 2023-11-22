import React from 'react'
import { useState, useEffect } from 'react'
import { auth, db } from '../firebase'; 
import Todo from './Todo'
import TodoForm from './TodoFrom'
import Doing from './Doing'
import Done from './Done'
import { useTaskContext } from '../services/TaskContext';
import { useContext } from 'react';
import { filter, set } from 'lodash';

function Task({atualizarPorcentagem, filtro , setFiltro}) {
    const user = auth.currentUser;
    const [selectedTask, setSelectedTask] = useState(null);
    const [tarefasDoDia, setTarefasDoDia] = useState([]);



    const { tasks, updateTasks } = useTaskContext();

    const [todos, setTodos] = useState([])

    const [doings, setDoings] = useState([])

    const [dones, setDones] = useState([])

   useEffect(() => { 
    const tasksCollectionRef = db.collection('tasks');
    const todosCollectionRef = tasksCollectionRef.doc(user.uid).collection('todos');
    const doingCollectionRef = tasksCollectionRef.doc(user.uid).collection('doing');
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
    console.log(hoje);

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


     


      const unsubscribeDoing = doingCollectionRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const docData = {
            id: change.doc.id,
            category: change.doc.data().category,
            title: change.doc.data().title,
            description: change.doc.data().description,
            user: change.doc.data().user,
            date: change.doc.data().date,
          };
  
          if (change.type === "added") {
            setDoings((prevDoings) => [...prevDoings, docData]);
          } else if (change.type === "modified") {
            setDoings((prevDoings) =>
              prevDoings.map((doing) => (doing.id === docData.id ? docData : doing))
            );
          } else if (change.type === "removed") {
            setDoings((prevDoings) => prevDoings.filter((doing) => doing.id !== docData.id));
          }
        });
      });
    
      // Retornar uma função de limpeza para desinscrever o ouvinte quando o componente for desmontado
      return () => {
        unsubscribeDoing(); // Limpa o listener da coleção 'doing'
        // Adicione outras limpezas conforme necessário
      };

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
    
    
    const completeDoing = (id) => {
      const tasksCollectionRef = db.collection('tasks');
      const doingCollectionRef = tasksCollectionRef.doc(user.uid).collection('doing');
      const donesCollectionRef = tasksCollectionRef.doc(user.uid).collection('dones');
      completeTask(id, doingCollectionRef, donesCollectionRef);
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
      // Fechar os detalhes do evento quando o usuário clicar em algum lugar
      setSelectedTask(null);
    };

    const tarefasExibidas = filtro === 'day' ? tarefasDoDia : todos;


    const isTaskDelayed = (taskDate) => {
      const today = new Date().toISOString().split('T')[0];
      return taskDate < today; // Verifica se a data da tarefa é anterior à data atual
    };


    const filterTasks = (tasks) => {
      switch (filtro) {
        case 'day':
          return tasks.filter((task) => task.date.split('T')[0] === new Date().toISOString().split('T')[0]);

        case 'delayed': 
            return tasks.filter((task) => isTaskDelayed(task.date));   

            case 'week':
              const today = new Date();
              const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
              const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6)); // Saturday
              return tasks.filter((task) => {
                const taskDate = new Date(task.date);
                return taskDate >= startOfWeek && taskDate <= endOfWeek;
              });
        
              case 'month':
                const todayMonth = new Date();
                const startOfMonth = new Date(todayMonth.getFullYear(), todayMonth.getMonth(), 1); // Primeiro dia do mês
                const endOfMonth = new Date(todayMonth.getFullYear(), todayMonth.getMonth() + 1, 0); // Último dia do mês
                return tasks.filter((task) => {
                  const taskDate = new Date(task.date);
                  return taskDate >= startOfMonth && taskDate <= endOfMonth;
                });

        default:
          return tasks;
      }
    }

    const filteredTasks = filterTasks(tasks);

   
  
    
  
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
                           <div className="card card-tarefa card-doing">
                           <div className="card-body">
                <h5 className="card-title">Doing</h5>
                <div className="todo-list">
        {doings.map((doing) => (
         <Doing key={doing.id}  doing = {doing} removeDoing={removeDoing} completeDoing= {completeDoing}/>
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
     <div className='task-details ' onClick={closeTaskDetails}>
       <div className='details-header'>
       <h2>Detalhes da Tarefa</h2>
       </div>
       <div className='details-title'>
     <p >Titulo: {selectedTask.title}</p>
      </div>
    <div className='details-desc'>
    <p >Descrição: <br></br> {selectedTask.description}</p>
    </div>
    <div className='details-date'>
   <p >Data: {selectedTask.date}</p>
    </div>

       
     </div>
     </div>
      )}
                           
                           </div>
      
        
    </div>;
  }

export default Task