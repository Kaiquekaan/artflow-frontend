import { useState, useContext, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from "../Context/UserContext";







function Form({route, method}){
    const [singupErr, setSingupErr] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [consenha,  setConsenha] = useState('');
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [usertag, setUsertag] = useState('');
    const [progress, setProgress] = useState(5);  // Estado para a barra de progresso
    const [currentStep, setCurrentStep] = useState('register');  // Estado da etapa
    const [userbirth, setUserbirth] = useState('');
    const [loading, setLoading ] = useState(false);
    
    
    const navigate = useNavigate();
    

    const {token, setToken} = useContext(UserContext);

    useEffect(() => {
      if(token){
        setToken('');
      }
    }, [])

    const handleBack = () => {
        navigate('/');
      };

    const handleForgotPassword = () => {
        navigate('/ForgotPassword');
      };
    
    const handleSignup = () => {
        navigate('/signup');
      };

      const handleTransitionEnd = () => {
        setLoading(false); // Parar o spinner ao final da transição
      };


      const generateUsertag = async () => {
        setLoading(true);
        let newUsertag;
        let exists = true;
    
        while (exists) {
          const randomNumber = Math.floor(1000 + Math.random() * 9000); // Gera um número aleatório de 4 dígitos
          newUsertag = `${username}@${randomNumber}`;
    
          try {
            const response = await fetch(`/api/check-usertag/?usertag=${encodeURIComponent(newUsertag)}`);
            const data = await response.json();
            exists = data.exists;
          } catch (error) {
            console.error('Erro ao verificar usertag:', error);
            exists = false;
          }
        }
    
        setUsertag(newUsertag);
        setLoading(false);
    };
    

      const formatDateToEnglish = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona 1 pois os meses começam do 0
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      };



    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        
   /*  if (method === 'login' || senha === consenha){
        try{
          
          //Verifica se esta na etapa final do cadastro
         
            const res = await api.post(route, {
              username: email,  // Enviando como 'username', se ainda não foi personalizado para 'email'
              password: senha   // 'password', não 'senha'
          });
          
        
            if (method === "login") {      
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            }else{
                setProgress(50);
                setCurrentStep('username');
                console.log(currentStep);
            }

        }catch(error){
            alert(error)
        }finally{
            setLoading(false)
        }
      }else{
        alert("Digite a mesma senha");
      } */

        if (method === 'login'){
          try{
            const res = await api.post(route, {
              username: email,
              password: senha
            });

            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            setToken(res.data.access)
            
           
            navigate('/');
          
          }catch(error){
            console.log('Erro no login' , error);
            setSingupErr(true)
          }finally{
            setLoading(false)
          }
        } else if( method === 'register') {
          if(step === 1){

            if (!email || !senha || !consenha) {
              alert('Por favor, preencha todos os campos.');
              return;
            }


            if(senha !== consenha ){
              alert('As senhas não coincidem')
              return;
            }

            try {
              const res = await api.get(`/api/check_email/?email=${email}`);
              if (res.data.exists) {
                  alert('Este email já está registrado.');
                  return;
              }

              // Se o email não existir, avance para a próxima etapa
              setStep(2);
              setProgress(50);

          } catch (error) {
              console.error('Erro ao verificar o email:', error);
              alert('Erro ao verificar o email. Tente novamente.');
          }

          }else if(step === 2){
            

            try{
              setLoading(true)


              const formattedBirthDate = formatDateToEnglish(userbirth);

              console.log('Enviando dados para registro:', {
                username: username,
                password: senha,
                email: email,
                usertag: usertag,
                birth_date: formattedBirthDate
              });


              const res = await api.post(route, {
                username: username,
                password: senha,
                email: email,
                userdata: {
                  user_tag: usertag,
                  birth_date: formattedBirthDate,
                  friends: [],
                  followers: [],
                }
              });

              if(res.status === 201){
                navigate('/login')
              }else{
                alert('Erro na finalinzaçao da criaçao de usuario')
              }
             
            }catch( error){
              alert('Erro ao criar conta!')
            }finally{
              setLoading(false);
            }
          }
        }



    } 

   


    const btnText = method === 'login' ? "Entrar" : "Avançar";
    const styleMethod = method === 'login' ? "login" : "register";
    const inputLabel = method === 'login' ? "Username ou Email" : "Email";

 return <>
      <div className='div-logo'>
      <img src="https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/master/src/imagens/Af_logo.png?raw=true" alt="img-logo" className='img-logo' loading="lazy" />
      <img src="https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/feature-login/src/imagens/artflow_written.png?raw=true" alt="logo-name" loading="lazy" className="h1" />
      </div>
      {loading && <div className="spinner"></div>}
        <form className={ styleMethod + "-form"} onSubmit={handleSubmit} onTransitionEnd={handleTransitionEnd}>
        {styleMethod === 'register' ? (
         <div className="stap-bar-container"><div className="stap-bar"><div className="bar" style={{ width: `${progress}%`, transition: "width 0.5s ease", }}></div></div></div> 
        ): ''}
       
         {step === 1 && method === "register" && (
        <>
          <div className={`input-container ${step === 1 ? "active" : ""}`}>
          <label className='label-form' htmlFor="email">{inputLabel}</label>
          <input
            className={!singupErr ? 'input-form' : 'input-form-err'}
            placeholder='exemplo.email@gmail.com'
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className='label-form' htmlFor="senha">Senha</label>
          <input
            className={!singupErr ? 'input-form' : 'input-form-err'}
            placeholder='12345@'
            type="password"
            id="senha"
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />   
    
        <>
        <label className='label-form' htmlFor="consenha">Confirmar Senha:</label>
        <input
          className={!singupErr ? 'input-form' : 'input-form-err'}
          placeholder='12345@'
          type="password"
          id="consenha"
          name="consenha"
          value={consenha}
          onChange={(e) =>  setConsenha(e.target.value)}
          required
        /> 
        </>
    
          {!singupErr ? '' : <p className='label-err'>*Email ou senha incorretos</p>}
        </div>

        <button className='btn-form' type="submit" id="redirecionar">
        {btnText}
        </button>
         
      </>
    )}

    {step === 2 && method === "register" && (
       <>
        {/* Campos de Username e Tag */}
        <div className={`input-container ${step === 2 ? "active" : ""}`}>
          <label className='label-form' htmlFor="username">Username</label>
          <input
            className='input-form'
            placeholder='Apelido'
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
       {/* <div className="usertag-container">
          <label className='label-form' htmlFor="usertag">Tag</label>
          <input
            className='input-form'
            placeholder='Apelido@w2'
            type="text"
            id="usertag"
            value={usertag}
            onChange={(e) => setUsertag(e.target.value)}
            required
          />
      </div>*/}  

          <div className="usertag-container">
          <label className='label-form-tag' htmlFor="usertag">Tag</label>
          <div className="usertag-input-button">
          <input
            className='input-form'
            placeholder='Apelido@w2'
            type="text"
            id="usertag"
            value={usertag}
            onChange={(e) => setUsertag(e.target.value)}
            required
          />

            <button
              type="button"
              className="generate-usertag-btn"
              onClick={generateUsertag}
            >
              <FontAwesomeIcon icon={faRotate} />
            </button>
          </div>
      </div>


          <label className='label-form' htmlFor="userbirth">Data de Nascimento</label>
          <input
            className='input-form'
            type="date"
            id="userbirth"
            value={userbirth}
            onChange={(e) => setUserbirth(e.target.value)}
            required
          />
        </div>

        <button className='btn-form' type="submit">Finalizar</button>
       </>
      )}
  

      {method === "login" && (
       <>
        <div className="input-container active">
              <label className="label-form" htmlFor="email">
                Username ou Email
              </label>
              <input
                className={!singupErr ? "input-form" : "input-form-err"}
                placeholder="Username ou Email"
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label className="label-form" htmlFor="senha">
                Senha
              </label>
              <input
                className={!singupErr ? "input-form" : "input-form-err"}
                placeholder="12345@"
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

             <div className="link-redevained">
               <a href="" onClick={handleForgotPassword}>Esqueceu a senha? </a>
               </div>
            </div>

            <button className="btn-form" type="submit">
              Entrar
            </button>
           
            <>
            <hr />
            <p className='link'>Não tem uma conta? <a onClick={handleSignup} href="">Criar conta</a></p>
            </>
       </>  
      )}
   </form>
    
  
    </>
}

export default Form