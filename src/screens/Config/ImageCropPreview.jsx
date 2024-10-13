import { useRef, useState, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "../../setCanvasPreview";
import './ImageCropPreview.css';

const MIN_DIMENSION = 150;

const ImageCropPreview = ({ closeModal, updateImage, aspectRatio, initialImage }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(initialImage || "");
  const [crop, setCrop] = useState(null);
  const [error, setError] = useState("");

  // Atualiza imgSrc se initialImage mudar
  useEffect(() => {
    setImgSrc(initialImage);
  }, [initialImage]);

  // Função para inicializar o crop quando a imagem é carregada
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      aspectRatio || 1, // Aspecto dinâmico
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  // Função para finalizar o recorte e gerar a imagem cortada
  const handleCrop = () => {
    setCanvasPreview(
      imgRef.current, // HTMLImageElement
      previewCanvasRef.current, // HTMLCanvasElement
      convertToPixelCrop(
        crop,
        imgRef.current.width,
        imgRef.current.height
      )
    );
    const dataUrl = previewCanvasRef.current.toDataURL(); // Gera o base64 da imagem recortada
    updateImage(dataUrl); // Passa a imagem recortada para o componente pai
    closeModal(); // Fecha o modal após o recorte
  };

  return (
    <>
    <div className='post-overlay'></div>
    <div className="image-crop-preview-container">
     <div className='image-edit-title'><p>Editar imagem</p></div>
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Exibe a área de recorte se houver uma imagem */}
      <div className='canvas-container'>
      {imgSrc && (
        <div className="flex flex-col items-center" style={{
            height: '100%',
          }}>
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            aspect={aspectRatio || 1} // Permite alterar a proporção
            circularCrop={aspectRatio === 1} // Círculo para fotos de perfil
            keepSelection
            
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
      )}

      {/* Canvas invisível para processar o recorte */}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
      </div>
      <div className="controls-edit">
                <button onClick={closeModal} className='btn-white'>Cancelar</button>
                <button onClick={handleCrop} className='btn-blue'>Pronto</button>
            </div>
    </div>
    </>
  );
};

export default ImageCropPreview;
