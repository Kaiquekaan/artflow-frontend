import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({route, method}){

    const [singupErr, setSingupErr] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [consenha, setconSenha] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
      };
    
      const handleSignup = () => {
        navigate('/signup');
      };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        
     if (method === "login" || senha === consenha){
        try{
          const res = await api.post(route, {
            username: email,  // Enviando como 'username', se ainda não foi personalizado para 'email'
            password: senha   // 'password', não 'senha'
        });
            if (method === "login") {      
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            }else{
                navigate("/login")
            }

        }catch(error){
            alert(error)
        }finally{
            setLoading(false)
        }
      }else{
        alert("Digite a mesma senha")
      }
    } 

    const name = method === 'login' ? "Login" : "Cadastro";

    return <form className='login-form' onSubmit={handleSubmit}>
        <div className="img-logo">
          <img className='login-logo' src='https://github.com/Kaiquekaan/TaskBot/blob/master/src/imagens/MInimalista_Light_1.png?raw=true' alt="" />
        </div>
        <div className='titulo-login'>
          <h1 className='titulo'>{name}</h1>
          <p>Preencha os campos abaixo</p>
        </div>
        <div className='input-container'>
          <label className='label-login' htmlFor="email">E-mail:</label>
          <input
            className={!singupErr ? 'input-login' : 'input-login-err'}
            placeholder='exemplo.email@gmail.com'
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className='label-login' htmlFor="senha">Senha:</label>
          <input
            className={!singupErr ? 'input-login' : 'input-login-err'}
            placeholder='12345@'
            type="password"
            id="senha"
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

     {/* caso a pagina seja login ou cadastro */}     
    {method === 'login' ? (
          <div className='save-div'>
            <input
              type="checkbox"
              className='save'
              name="save"
              id="save"
              checked={stayLoggedIn}
              onChange={(e) => setStayLoggedIn(e.target.checked)}
            />
            <label htmlFor="save">Manter logado</label>
          </div>
    ):(
        <>
        <label className='label-login' htmlFor="consenha">Confirmar Senha:</label>
        <input
          className={!singupErr ? 'input-login' : 'input-login-err'}
          placeholder='12345@'
          type="password"
          id="consenha"
          name="consenha"
          value={consenha}
          onChange={(e) => setconSenha(e.target.value)}
          required
        /> 
        </>
    )}
          {!singupErr ? '' : <p className='label-err'>*Email ou senha incorretos</p>}
        </div>

        <button className='btn-login' type="submit" id="redirecionar">
          Confirmar
        </button>
        <button onClick={handleBack} className='btn-back' type="button">
          Voltar
        </button>
         {method === 'login' ? (
            <p className='link'>Não possui conta? <a onClick={handleSignup} href="">Criar conta</a></p>
         ): ""}
        
      </form>
}

export default Form