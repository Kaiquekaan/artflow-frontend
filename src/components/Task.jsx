import React from 'react'
import { useState, useEffect } from 'react'
import { auth, db } from '../firebase'; 
import Todo from './Todo'
import TodoForm from './TodoFrom'
import Doing from './Doing'
import Done from './Done'


function Task() {
    const user = auth.currentUser;

    const [todos, setTodos] = useState([
      
    ])

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
        setTodos(todos);
      })
      .catch((error) => {
        console.error('Erro ao obter todos do usuário: ', error);
      });

      doingCollectionRef.get()
      .then((querySnapshot) => {
        const doings = [];
        querySnapshot.forEach((doc) => {
          doings.push({
            id: doc.id,
            category: doc.data().category,
            title: doc.data().title,
            description: doc.data().description,
            user: doc.data().user,
            date: doc.data().date, // Use a data real do documento
          });
        });
        setDoing(doings);
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
   }, []);
  

    const [doing, setDoing] = useState([
      
    ])

    const [dones, setDones] = useState([
      
    ])
  
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
    
    const completeTask = (id, sourceCollectionRef, sourceState, targetCollectionRef, targetState) => {
      sourceCollectionRef.doc(id).get()
        .then((doc) => {
          if (doc.exists) {
            const taskData = doc.data();
    
            // Adicione a tarefa à coleção de destino no banco de dados
            targetCollectionRef.doc(id).set(taskData)
              .then(() => {
                console.log('Tarefa movida com sucesso.');
              })
              .catch((error) => {
                console.error('Erro ao mover tarefa: ', error);
              });
    
            // Exclua a tarefa da coleção de origem no banco de dados
            sourceCollectionRef.doc(id).delete()
              .then(() => {
                console.log('Tarefa removida com sucesso.');
                // Atualize o estado local após o sucesso da operação no Firebase
                sourceState((prevTasks) => prevTasks.filter((task) => task.id !== id));
                // Atualize o estado local do destino
                targetState((prevTasks) => [...prevTasks, taskData]);
              })
              .catch((error) => {
                console.error('Erro ao remover tarefa: ', error);
              });
          } else {
            console.error('Tarefa não encontrada na coleção de origem.');
          }
        })
        .catch((error) => {
          console.error('Erro ao obter tarefa da coleção de origem: ', error);
        });
    };
    
    const completeTodo = (id) => {
      const tasksCollectionRef = db.collection('tasks');
      const todosCollectionRef = tasksCollectionRef.doc(user.uid).collection('todos');
      const doingCollectionRef = tasksCollectionRef.doc(user.uid).collection('doing');
      completeTask(id, todosCollectionRef, setTodos, doingCollectionRef, setDoing);
    };
    
    const completeDoing = (id) => {
      const tasksCollectionRef = db.collection('tasks');
      const doingCollectionRef = tasksCollectionRef.doc(user.uid).collection('doing');
      const donesCollectionRef = tasksCollectionRef.doc(user.uid).collection('dones');
      completeTask(id, doingCollectionRef, setDoing, donesCollectionRef, setDones);
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
    
    const removeDoing = (id) => {
      const doingCollectionRef = db.collection('tasks').doc(user.uid).collection('doing');
      removeTask(id, doingCollectionRef, setDoing);
    };
    
  
    
  
    return <div className="task">

       <div className="card-container">
          <div className="card card-tarefa">
          <div className="card-body">
                <h5 className="card-title">To Do</h5>
                <div className="todo-list">
        {todos.map((todo) => (
         <Todo key={todo.id} todo = {todo} removeTodo={removeTodo} completeTodo= {completeTodo}/>
        ))}
      </div>
      
      </div> 
                           </div>
                           <div className="card card-tarefa">
                           <div className="card-body">
                <h5 className="card-title">Doing</h5>
                <div className="todo-list">
        {doing.map((todo) => (
         <Doing key={todo.id}  doin = {todo} removeDoing={removeDoing} completeDoing= {completeDoing}/>
        ))}
      </div>
      
      </div> 
                           </div>
                           <div className="card card-tarefa">
                           <div className="card-body">
                <h5 className="card-title">Done</h5>
                <div className="todo-list">
        {dones.map((todo) => (
         <Done key={todo.id} todo = {todo} removeTodo={removeTodo} completeTodo= {completeTodo}/>
        ))}
      </div>
      
      </div> 
                           </div>
                           
                           </div>
      
        
    </div>;
  }

export default Task