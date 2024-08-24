import React, { useState, useEffect } from 'react';
import './Custom.css';
import { auth, db , storage} from '../../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 


function Custom(){
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [singupErr, setSingupErr] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profileImages, setProfileImages] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleBack = () => {
    navigate('/');
  };

   useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Listar as imagens de perfil disponíveis no Firebase Storage
      listProfileImages();
    }
  }, [user, navigate]);

  const listProfileImages = async () => {
    try {
      const listRef = storage.ref('perfils_imagens');
      const result = await listRef.listAll();
      const urls = await Promise.all(result.items.map(async (itemRef) => {
        const url = await itemRef.getDownloadURL();
        return { url, name: itemRef.name };
      }));
      setProfileImages(urls);
    } catch (error) {
      console.error('Erro ao listar imagens de perfil:', error.message);
    }
  };

      
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setPreviewUrl(null);
        }
      };

       const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor, selecione um arquivo.');
      return;
    }

    try {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`uploadedProfiles/${user.uid}_${selectedFile.name}`);
      await fileRef.put(selectedFile);
      const uploadedUrl = await fileRef.getDownloadURL();
      setUploadedImageUrl(uploadedUrl); // Atualiza o estado da imagem enviada
      setPreviewUrl(uploadedUrl); // Define como imagem pré-visualizada
      alert('Upload de imagem bem-sucedido!');
    } catch (error) {
      console.error('Erro ao fazer upload de imagem:', error.message);
      alert('Erro ao fazer upload de imagem. Por favor, tente novamente.');
    }
  };
      
      const handleProfileUpdate = async (e) => {
        e.preventDefault();
    
        try {
          let photoURL = '';
    
          // Upload da imagem, se uma estiver selecionada
          if (selectedFile) {
            const storageRef = storage.ref();
            const fileRef = storageRef.child(`profilePics/${user.uid}`);
            await fileRef.put(selectedFile);
            photoURL = await fileRef.getDownloadURL();
          }
    
          // Atualiza o perfil do usuário com o nome de exibição e a URL da foto, se disponível
          await user.updateProfile({
            displayName,
            photoURL,
          });
    
          // Atualiza o documento do usuário no Firestore
          await db.collection('users').doc(user.uid).update({
            displayName,
            photoURL,
          });
    
          alert('Perfil atualizado com sucesso!');
          navigate('/home'); // Redireciona para a home
        } catch (error) {
          console.error('Erro ao atualizar perfil:', error.message);
          alert('Erro ao atualizar perfil: ' + error.message);
        }
      };

      
    return(
        <div className='body'> 
          <form className='form-custom' onSubmit={handleProfileUpdate}>
            <div className="img-logo">
              <img className='login-logo' src='https://github.com/Kaiquekaan/TaskBot/blob/master/src/imagens/MInimalista_Light_1.png?raw=true' alt="" />
            </div>
            <div className='titulo-login'>
             <h1 className='titulo'>Aparencia</h1>
            <p>Preencha os campos abaixo</p>
            </div>
            <div className='input-container'>
            <label className='label-login' htmlFor="displayName">Nome de Exibição:</label>
            <input
              className='input-login'
              placeholder='User name'
              type='text'
              id="displayName"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <div>
            <label className='label-image' htmlFor="Username">Imagem Avatar</label> 
            <div className='preview-container'>
              <div className='imagens'> 
              <div className='profile-images-grid'>
                {profileImages.map((image) => (
                  <img
                    key={image.name}
                    src={image.url}
                    alt="Opção de perfil"
                    className={`profile-image-option ${image.url === previewUrl ? 'selected' : ''}`}
                    onClick={() => setPreviewUrl(image.url)}
                    style={{ cursor: 'pointer', maxWidth: '50px', margin: '5px' }}
                  />
                ))}
                 {previewUrl && (
                 <img src={previewUrl} alt="Preview" className='image-preview' style={{ maxWidth: '50%', marginTop: '10px' }} />
                 )}
              </div>
           
          </div>
          
            </div>
            <div className='btns-imagens'>
            <p className='btns-p'>Envie sua propria imagem</p> 
            <input type="file" className='file' onChange={handleFileChange} />
            </div>
            {!singupErr ? '' : <p className='label-err' >*Senhas devem ser iguais</p>}
          </div>
         </div>
            <button className='btn-login' type="submit" id="redirecionar">
            Confirmar 
            </button>
            <button onClick={handleBack} className='btn-back' type="button" >
            Voltar
            </button>
          
          </form>
          
        </div>
          

        
      
    )
}

export default Custom;