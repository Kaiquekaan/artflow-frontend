
import { auth } from '../firebase';
import { google } from 'googleapis';


const GoogleCalendarService = {
    async getGoogleCalendarAccessToken() {
      const user = auth().currentUser;
  
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
  
      // Obtenha o token de acesso do usuário autenticado.
      const token = await user.getIdToken();
  
      // Use o token de acesso para autenticar com a API do Google Calendar.
      // Configure as chamadas à API do Google Calendar usando o token de acesso.
      const tasks = google.tasks({
        version: 'v1',
        auth: token, // Use o token de acesso como autenticação
      });
  
      // Agora você pode fazer chamadas à API do Google Calendar com o token de acesso.
      const date = '2023-11-05';


      tasks.tasks.list({
        tasklist: 'TAREFAS_ID', // Substitua pelo ID da lista de tarefas
      }, (err, res) => {
        if (err) return console.error('Erro ao listar tarefas:', err);
      
        const tarefasDoDiaEspecificado = res.data.items.filter(tarefa => {
          // Substitua 'due' e 'date' pelas propriedades corretas em suas tarefas
          return tarefa.due && tarefa.due.date === dataEspecifica;
        });
      
        console.log('Tarefas do dia especificado:', tarefasDoDiaEspecificado);
      }
      );
      
    },

  };


export default  GoogleCalendarService;