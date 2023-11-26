import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import TodoForm from './TodoFrom';
import { auth, db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark} from '@fortawesome/free-solid-svg-icons';
import { TaskContext } from '../services/TaskContext';
import { useContext } from 'react';






const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const { tasks, updateTasks } = useContext(TaskContext);
  const [isCalendarActive, setCalendarActive] = useState(false); // Estado para controlar a classe "active"
  const [selectedEvent, setSelectedEvent] = useState(null); // Estado para controlar o evento selecionado
  const user = auth.currentUser;
  const tasksCollectionRef = db.collection('tasks');
  const todosCollectionRef = tasksCollectionRef.doc(user.uid).collection('todos');

  


  useEffect(() => {
    // Realiza a consulta inicial e atualiza o estado tasks apenas uma vez
    todosCollectionRef.get().then((querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((doc) => {
        const task = doc.data();
        task.id = doc.id;
        tasks.push(task);
      });
      updateTasks(tasks);
    });
  }, []); // O array vazio [] garante que isso só seja executado uma vez

  const fetchData = () => {
    const tasksCollectionRef = db.collection('tasks');
    const todosCollectionRef = tasksCollectionRef.doc(user.uid).collection('todos');
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
          updateTasks(todos);
        })
        .catch((error) => {
          console.error('Erro ao obter todos do usuário: ', error);
        });

    };
  


  const addTodo = (title, category, desc) => {
    if (title && selectedDate) {
      const newTask = {
        user: user.uid,
        title: title,
        description: desc,
        category: category,
        date: selectedDate.toISOString(),
      };

      todosCollectionRef.add(newTask)
        .then((docRef) => {
          console.log('Evento salvo com ID: ', docRef.id);
          fetchData(); // Chama a função para buscar os dados atualizados
        })
        .catch((error) => {
          console.error('Erro ao salvar evento: ', error);
        });

      setCalendarActive(false);
      setTaskTitle('');
      setTaskDescription('');
      setSelectedDate(null);
    }
  };

  
  
  const calendarRef = React.createRef();

  const handleDateClick = (info) => {
    setSelectedDate(info.date);
    setCalendarActive(true);
  };

  const handleTaskSubmit = () => {
    if (taskTitle && selectedDate) {
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        date: selectedDate.toISOString(),
      };
      setTasks([...tasks, newTask]);

      

      // Aqui você pode adicionar a lógica para armazenar a tarefa no banco de dados.

      // Limpa os campos após a adição da tarefa.
      setTaskTitle('');
      setTaskDescription('');
      setSelectedDate(null);
    }
  };
  const handleEventClick = (info) => {
    // Quando o usuário clicar em um evento, definimos o evento selecionado no estado.
    setSelectedEvent(info.event);
  };

  const closeEventDetails = () => {
    // Fechar os detalhes do evento quando o usuário clicar em algum lugar
    setSelectedEvent(null);
  };

  const eventContent = (arg) => {
    // Personalize a aparência dos eventos aqui
    return (
      <div className='event-calender'>
        <strong>{arg.timeText}</strong>
        <p>{arg.event.title}</p>
      </div>
    );
  };


  const transformTasksForCalendar = (tasks) => {
    return tasks.map((task) => ({
      title: task.title, 
      description: task.description,
      date: task.date// Você pode precisar ajustar a propriedade de data conforme necessário
      // Adicione outras propriedades relevantes do seu objeto de tarefa
    }));
  };

  useEffect(() => { 
    // Atualiza o calendário quando o estado tasks for alterado
    calendarRef.current.getApi().removeAllEvents();
    calendarRef.current.getApi().addEventSource(transformTasksForCalendar(tasks));
  }, [tasks]);

  const events = transformTasksForCalendar(tasks);

  const toggleCalendar = () => {
    setCalendarActive(!isCalendarActive);
  };




  return (
    <div className='calendar-container '>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
        eventContent={eventContent}
        eventClick={handleEventClick} // Lidar com o clique em eventos
      />

      {/* Adicione ou remova a classe "active" com base no estado */}
      
      <div className={`calender-task ${isCalendarActive ? 'active' : ''}`}>
      <div className='page-overlay'></div>
        <div className='calender-add'>
          <div className='add-header'>
             <button className='btn-close-add' onClick={toggleCalendar}><FontAwesomeIcon icon={faXmark} /></button>
             <h2>Adicionar tarefas</h2>
             </div>
             <div className="add-body">
          {selectedDate && <TodoForm addTodo={addTodo} />}
          </div>
         </div>
      
        
      </div>
     

      {selectedEvent && (
        <div className="page">
          <div className='page-overlay'></div>
        <div className='event-details ' >
        <button className='close-button' onClick={closeEventDetails}><FontAwesomeIcon icon={faXmark} /></button>
          <div className='details-header'>
          <h2>Detalhes da Tarefa</h2>
          </div>
          <div className='details-title'>
          <p >Titulo: {selectedEvent.title}</p>
          </div>
          <div className='details-desc'>
          <p >Descrição: <br></br> {selectedEvent.extendedProps.description}</p>
          </div>
          <div className='details-date'>
          <p >Data: {selectedEvent.start.toLocaleString()}</p>
          </div>
          
        </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;