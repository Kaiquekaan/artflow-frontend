import React, {useState} from 'react'
import './Cadastro.css'
import { auth } from '../../firebase';





const Cadastro = () => {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleCadastroSubmit = async (e) => {
        e.preventDefault();
    
        try {
          // Crie um novo usuário com e-mail/senha usando o Firebase
          await auth.createUserWithEmailAndPassword(email, senha);
    
          // Se o cadastro for bem-sucedido, você pode redirecionar o usuário ou realizar outras ações necessárias
          console.log('Cadastro bem-sucedido!');
        } catch (error) {
          console.error('Erro ao cadastrar:', error.message);
        }
      };


      return (
        <div>
          <form className='cadas-form' onSubmit={handleCadastroSubmit}>
          <div className="img-logo">
            <img className='login-logo' src="https://github.com/Kaiquekaan/TaskBot/blob/master/src/imagens/logo2.png?raw=true" alt="logo.png" />
            </div>
            <div className='titulo-cadas'>
            <label htmlFor="nome">Cadastro</label>
            </div>
            <label htmlFor="email">E-mail:</label>
            <input
            className='input-cadas'
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="senha">Senha:</label>
            <input
            className='input-cadas'
              type="password"
              id="senha"
              name="senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <input className='btn-login' type="submit" value="Cadastrar" />
            <a href="#">Sobre</a>
          </form>
        </div>
      );
    
}

export default Cadastro;























