import React from 'react'
import { useEffect, useState, useRef } from 'react';
import api from '../api';
import FileUpload from './FileUpload';
import EditPostFileUpload from './EditPostFileUpload';

const NewPost = ({ user, onCancel, route, postToEdit = null }) =>{
  const [files, setFiles] = useState(postToEdit ? postToEdit.media_files : []);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState(postToEdit ? postToEdit.caption : '');
  const [isPrivate, setIsPrivate] = useState(postToEdit ? postToEdit.is_private : false);
  const [isSensitive, setIsSensitive] = useState(postToEdit ? postToEdit.is_sensitive : false);
  const postFormRef = useRef(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [filesToRemove, setFilesToRemove] = useState([]);

  console.log(postToEdit)

 
  useEffect(() => {
    if (postToEdit && postToEdit.media_files) {
      setFiles(postToEdit.media_files.map(media => ({ file: media.file, url: media.file_url })));
    }
  }, [postToEdit]);

  // Função para lidar com o arrastar sobre a área
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Função para lidar quando o usuário solta os arquivos
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files); // Converte para array
    const validFiles = droppedFiles.filter(file =>
      (file.type.startsWith('image/') || file.type.startsWith('video/')) && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length < droppedFiles.length) {
      alert('Alguns arquivos foram ignorados porque excedem o limite de 10MB.');
  }

  // Verifica se o total de arquivos válidos e os já adicionados excede o limite de 5
    if (files.length + validFiles.length <= 5) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);  // Adiciona arquivos válidos
    } else if (files.length > 5) {
      alert(`Você pode selecionar no máximo 5 arquivos.`);
    }
  };

  // Função para lidar com a seleção via botão de upload
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file =>
      (file.type.startsWith('image/') || file.type.startsWith('video/')) && file.size <= 10 * 1024 * 1024
    );
    
    if (validFiles.length < selectedFiles.length) {
        alert('Alguns arquivos foram ignorados porque excedem o limite de 10MB.');
    }
    

    if (files.length + validFiles.length <= 5) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);  // Adiciona arquivos válidos
      } else if (files.length > 5) {
      alert(`Você pode selecionar no máximo 5 arquivos.`);
      }


      e.target.value = null;
  };

  const handleFilesToRemove = (removedFiles) => {
    setFilesToRemove(removedFiles);
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleAdvanceClick = () => {
    setShowForm(true);  // Mostra o form
    setTimeout(() => {
      if (postFormRef.current) {
        postFormRef.current.classList.add('active'); 
        
         // Adiciona a classe "active" após um pequeno atraso
      }
    }, 300);
  };
  
  const handleBackClick = () => {
    if (postFormRef.current) {
      postFormRef.current.classList.remove('active'); 
      
   // Remove a classe "active"
    }
    setTimeout(() => {
      setShowForm(false);  // Esconde o form após a animação
    }, 300);  // Ajustar esse tempo para a duração da animação
  };


  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        let res;
        const formData = new FormData();
        formData.append('caption', message);
        formData.append('is_sensitive', isSensitive);
        formData.append('is_private', isPrivate);

        files.forEach((file) => {
            if (file.url) {
                formData.append('existing_files', file.url);  // Arquivo existente
            } else {
                formData.append('files', file);  // Novo arquivo
            }
        });

        console.log('Arquivos: ', formData)

        if (postToEdit) {
            res = await api.put(route , formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } else {
            res = await api.post(route, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }

        console.log('Post salvo com sucesso!', res.data);
        setIsLoading(false);
        onCancel();
    } catch (error) {
        setIsLoading(false);
        console.error("Erro ao salvar post:", error.response ? error.response.data : error.message);
        // Mostrar feedback amigável ao usuário
        alert(`Erro ao salvar post: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    }
};

    return(
    <>
     <div className='post-overlay'></div>
     
     <div className={`post-container ${files.length > 0  ? 'active' : ''}`}>
        <div className='post-header'>
            <p>Post</p>
        </div>
        <div className='post-content'>

        {files.length > 0 && postToEdit && <EditPostFileUpload files={files} setFiles={setFiles} onRemove={handleFilesToRemove}/>}

        {files.length > 0 &&  <FileUpload files={files} setFiles={setFiles} />}

        {isLoading && <div className='spinner-container'><div className="spinner"></div></div>}
          
      
      <div className='post-form-container'>
       {showForm ? (
            <div  className='post-form ' ref={postFormRef}>
                <a
              href="#"
              className="d-flex align-items-center p-2 link-dark text-decoration-none post-user-container"
              id="dropdownUser3"
               data-bs-toggle="dropdown"
              aria-expanded="false"
              >
             <img
             src={!user ? '' : user.userdata.profile_picture_url} //user.usedata.profile_picture_url
            alt="mdo"
            width={40} // tamanho adequado para ser mais visível
            height={40}
            className="rounded-circle me-2 ms-2" // Adiciona margem à direita
            />
        <div className="user-info">
            <p className="user-displayname mb-0">{user?.userdata.displayname ? user?.userdata.displayname : user?.username}</p>
            <p className="user-email mb-0">{user?.userdata.user_tag}</p>
        </div>
      </a>  
            <div className='post-message'>
              <textarea 
                placeholder='Mensagem da postagem' 
                value={message} 
                maxLength={1000}
                onChange={(e) => setMessage(e.target.value)} 
              />
               <p>{message.length}/1000</p>
            </div>
              <div className='post-config'>
                <p>Configurações adicionais</p>
                <div className='post-config-item'>
                <div className="toggle-container"> 
                <label class="switch">
                <input 
                  type='checkbox' 
                  checked={isPrivate} 
                  onChange={(e) => setIsPrivate(e.target.checked)} 
                />
                <span class="slider"></span>
              </label><label>Privado</label>
            </div>
              <p>Essa postagem será visível apenas para <span>seus amigos.</span> Usuários que não são seus amigos não poderão ver este conteúdo.</p>
              </div>
              <div className='post-config-item'> 
              <div className="toggle-container"> 
              <label class="switch">
                <input 
                  type='checkbox' 
                  className='checkbox-post'
                  checked={isSensitive} 
                  onChange={(e) => setIsSensitive(e.target.checked)} 
                />
                <span class="slider"></span>
              </label>
                 <label>Conteúdo sensível</label>
                 </div>
                 <p>Esta postagem contém conteúdo que pode não ser apropriado para <span>menores de 14 anos.</span> Usuários menores de 14 anos não terão acesso a este post.</p>
              </div>
              </div>
            </div>
          ): (
            <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className='dragover-container'
            >
            <img src="https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/master/src/imagens/Upload_White.png?raw=true" className='img-uplade-icon' alt="upladeimg" />
            <p className='text-content'>Arraste e solte suas imagens ou vídeos aqui</p>
            <input
              type="file"
              multiple
              accept="image/*, video/*"
              onChange={handleFileSelect}
              id="fileInput"
              style={{ display: 'none' }} 
            />
      
            <button onClick={handleClick} className='btn-white'>
              Selecionar arquivos
            </button>
      
           
            
          </div>
          )}
      
      </div>
       
        </div>
        <div className='post-footer-container'>
        <div className='post-footer'>
        {showForm ? (
            <button className='btn-white' onClick={handleBackClick}>Voltar</button>
          ): (
            <button className='btn-white' onClick={onCancel}>Cancelar</button>
          )}
            {showForm ? (
            <button className='btn-blue' onClick={handlePostSubmit}>{postToEdit ? 'Salvar Alterações' : 'Postar'}</button>
          ): (
            <button className='btn-blue' onClick={handleAdvanceClick}>Avançar</button>
          )}
        </div>
        </div>
      </div>

      
      </>
    )
}

export default NewPost