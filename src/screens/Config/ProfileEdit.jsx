import React, { useState, useContext, useRef } from 'react';
import { UserContext } from '../../Context/UserContext';
import ImageCropPreview from './ImageCropPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark
 } from '@fortawesome/free-solid-svg-icons';
import api from '../../api';


function ProfileEdit({style , parent, onClose, parentQueryClient, invalidate}){
    const { data: userContextData } = useContext(UserContext);
    const { queryClient } = useContext(UserContext);
    const [isPrivate, setIsPrivate] = useState(userContextData?.userdata.is_private || false);
    const [showCropPreview, setShowCropPreview] = useState(false);
    const [isBanner, setIsBanner] = useState(false);
    const [profileImage, setProfileImage] = useState(userContextData?.userdata.profile_picture_url || '');
    const [bannerImage, setBannerImage] = useState(userContextData?.userdata.banner_picture_url || '');
    const [selectedImage, setSelectedImage] = useState(null);
    const profilePicInputRef = React.useRef();
    const bannerPicInputRef = React.useRef();
    const [loading, setLoading] = useState(false);

    const [displayName, setDisplayName] = useState(userContextData?.userdata.displayname || '');
    const [userTag, setUserTag] = useState(userContextData?.userdata.user_tag || '');
    const [tagAvailable, setTagAvailable] = useState(null);  // null: não verificado, true: disponível, false: indisponível
    const [loadingTagCheck, setLoadingTagCheck] = useState(false);
    const [bio, setBio] = useState(userContextData?.userdata.bio || '');

    const handleCroppedImage = (croppedImage) => {
      if (isBanner) {
          setBannerImage(croppedImage); // Atualiza o banner com a imagem recortada
      } else {
          setProfileImage(croppedImage); // Atualiza a foto de perfil com a imagem recortada
      }
      setShowCropPreview(false); // Fecha o modal de recorte
  };

  const checkUserTagExists = async (userTag) => {
    setLoadingTagCheck(true);
    setTagAvailable(null);  // Resetar o estado antes de verificar
  
    try {
      const res = await api(`/api/check-usertag/?usertag=${encodeURIComponent(userTag)}`);
      console.log('resposta da verficaçao de tag: ', res)
      setTagAvailable(res.data.exists);  // Se a tag não existir, está disponível
      console.log('salvo no TagAvailble: ', res.data.exists)
    } catch (error) {
      console.error('Erro ao verificar usertag:', error);
    } finally {
      setLoadingTagCheck(false);  // Finaliza o carregamento
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const newData = { userdata: {} };

    // Checa e adiciona os campos alterados
    if (displayName !== userContextData.userdata.displayname) newData.userdata.displayname = displayName;
    if (userTag !== userContextData.userdata.user_tag) {
        const userTagExists = await checkUserTagExists(userTag);
        if (userTagExists) {
            alert('Este tag já está em uso. Por favor, escolha outro.');
            return; 
        }
        newData.userdata.user_tag = userTag;
    }
    if (bio !== userContextData.userdata.bio) newData.userdata.bio = bio;
    if (profileImage !== userContextData.userdata.profile_picture_url) newData.userdata.profile_picture_url = profileImage;
    if (bannerImage !== userContextData.userdata.banner_picture_url) newData.userdata.banner_picture_url = bannerImage;
    if (isPrivate !== userContextData.is_private) newData.userdata.is_private = isPrivate;

    if (Object.keys(newData.userdata).length === 0) {
        alert('Nenhuma alteração detectada.');
        return;
    }

    try {
        const response = await api.patch('/api/user/update/', newData
      );  // Usando o método PATCH
        queryClient.invalidateQueries(['userData']);
        queryClient.refetchQueries(['userData']);
        console.log('Dados do usuário atualizados com sucesso:', response.data);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
    } finally {
        setLoading(false);
        if (parent === 'profilepage') {
            onClose();
        }
    }
};
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
            setShowCropPreview(true);
            if (event.target.name === 'banner') {
                setIsBanner(true);
            } else {
                setIsBanner(false);
            }
        };
        reader.readAsDataURL(file);
        // Resetar o input para permitir a seleção da mesma imagem
        event.target.value = '';
    }
};

    const handleChangeProfilePic = (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setSelectedImage(reader.result);
              setIsBanner(false);
              setShowCropPreview(true); // Mostra o modal de recorte
          };
          reader.readAsDataURL(file);
      }
  };

     const handleChangeBanner = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setIsBanner(true);
                setShowCropPreview(true); // Mostra o modal de recorte
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCloseCropPreview = () => {
      setShowCropPreview(false);
  };

  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), delay);
    };
  }

  const debounceCheckUserTag = debounce((tag) => {
    if (tag.trim().length > 0) {
      checkUserTagExists(tag);
    } else {
      setTagAvailable(null);  // Reseta o estado se a tag estiver vazia
    }
  }, 1500);

  const handleUserTagChange = (tag) => {
    setUserTag(tag);  // Atualiza o input imediatamente
    debounceCheckUserTag(tag);  // Verifica a tag com atraso
  };

  return <div className='profile-edit-section'>
    <div className={`profile-edit-save ${style ? style : ''}`}>
       <p>Editar Perfil</p>
      <div className='profile-edit-btn-container'>
        {parent && (
          <button className='btn-white profile-edit' onClick={onClose}>Cancelar</button>
        )}
      
      <button className='btn-save-alterations' onClick={handleSave}>{loading ? <div className="spinner-save"></div> : 'Salvar'}</button>
      </div>
    </div>
    <div className={`profile-edit-sidebar ${style ? style : ''}`}>
    <div className='profile-edit-header' 
     style={{
            backgroundImage: `url(${bannerImage})`, // Define a imagem de fundo do banner
            backgroundSize: 'cover', // Cobre todo o espaço do banner
            backgroundPosition: 'center' // Centraliza a imagem
          }}>
    <div className='profile-edit-pic-container'>
    <img src={profileImage} alt="" className='profile-edit-user-pic' />
    </div>  
    <div className='achievement-container'></div>
    </div>
    <div className='profile-edit-main'>
    <div className='profile-edit-main-header'>
   
    <div className='profile-edit-input-container'>
    <div className='profile-edit-btns-container'>
    <input 
                  type="file" 
                  accept="image/*" 
                  name="profile" 
                  onChange={handleImageUpload}
                  style={{ display: 'none' }} 
                  id="profile-pic-upload"
                  ref={profilePicInputRef}
                />
                <label htmlFor="profile-pic-upload" className="profile-edit-btn">Alterar miniatura</label>

                {/* Input para alterar o banner */}
                <input 
                  type="file" 
                  accept="image/*" 
                  name="banner" 
                  onChange={handleImageUpload}
                  style={{ display: 'none' }} 
                  id="banner-upload"
                  ref={bannerPicInputRef}
                />
                <label htmlFor="banner-upload" className="profile-edit-btn">Alterar banner</label>
   </div>
   <div className='profile-edit-item'>
    <p>Para a melhor experiência visual, recomendamos que sua imagem de perfil tenha dimensões de <span>400 x 400</span> pixels e a imagem de fundo de perfil tenha <span>1500 x 500</span> pixels. Certifique-se de que ambos os arquivos tenham até <span>2 MB</span> para garantir um carregamento rápido e sem problemas.</p>
    </div> 
    </div>
    </div> 
     <div className='profile-edit-input-container'>
      <div className='profile-edit-item'>
        <label htmlFor="" className='lbl-profile-input'>Nome de exibição</label>
        <input type="text" placeholder='DisplayName' value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <p>Este é o nome que será exibido para os outros usuários <span>em vez do seu username.</span> Alterar o <span>nome de exibição </span>não afeta seu <span>username.</span></p>
        </div>
        <div className='profile-edit-item'>
        <label htmlFor="" className='lbl-profile-input'>Tag</label>
        <div className='input-config-container'>
        <input type="text" placeholder='@UserTag' 
                value={userTag} 
                onChange={(e) => handleUserTagChange(e.target.value)} />
                {loadingTagCheck && <div className='spinner-config'></div>}
                {tagAvailable === false && <div className="available-icon"><FontAwesomeIcon icon={faCircleCheck} /></div>}
                {tagAvailable === true && <div className="exits-icon"><FontAwesomeIcon icon={faCircleXmark} /></div>}
        </div>
        <p>A sua tag é um identificador único, que ajuda outras pessoas a <span>encontrarem você</span>. Ela aparece após o símbolo '@' e pode ser usada para facilitar <span>menções e buscas</span> pelo seu perfil.</p>
        </div>
        <div className='profile-edit-item'>
        <label htmlFor="" className='lbl-profile-input'>Bio</label>
        <textarea cols="30" rows="10" placeholder='Conte um pouco sobre você...'
        value={bio} 
        onChange={(e) => setBio(e.target.value)}
        ></textarea>
        <p>Esta é a informação que será exibida no seu <span>perfil.</span> Você pode alterá-la a <span>qualquer momento.</span></p>
        </div>
        <div className='post-config'>
                <p>Configurações adicionais</p>
                <div className='post-config-item'>
                <div className="toggle-container"> 
                <label class="switch" >
                <input 
                  type='checkbox' 
                  checked={isPrivate} 
                  onChange={(e) => setIsPrivate(e.target.checked)} 
                  
                />
                <span class="slider"></span>
              </label><label>Perfil Privado</label>
            </div>
              <p>Seu perfil será visível apenas para <span>seus amigos e seguidores.</span> Usuários que não são seus amigos não poderão ver seu conteúdo.</p>
              </div>
            </div> 
     </div>
    
    </div> 
       
    </div>
    <div className='profile-edit-content'>
        
    </div>
    {showCropPreview ? (
    isBanner ? (
      <ImageCropPreview
      closeModal={handleCloseCropPreview}
      updateImage={handleCroppedImage}
      aspectRatio={3} // ou outro valor que você queira
      initialImage={selectedImage} // URL da imagem enviada
/>
    ) : (
      <ImageCropPreview
      closeModal={handleCloseCropPreview}
      updateImage={handleCroppedImage}
      aspectRatio={1} // ou outro valor que você queira
      initialImage={selectedImage} // URL da imagem enviada
/>
  
    )
) : null}
    
    
   </div>
}

export default ProfileEdit