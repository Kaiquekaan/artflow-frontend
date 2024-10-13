import React, { useState, useEffect, useRef } from 'react';
import './ImageCropPreview.css';

const BannerCropPreview = ({ onImageUpload, isVisible, onClose, src }) => {
    const [image, setImage] = useState(src || null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 320, height: 180 }); // Proporção 16:9 para banner
    const [isDragging, setIsDragging] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [scaledImageSize, setScaledImageSize] = useState({ width: 0, height: 0 });
    const canvasRef = useRef(null);
    const imgRef = useRef(new Image());

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = (event) => {
        if (event.button === 0) {
            setIsDragging(true);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const boundingRect = event.currentTarget.getBoundingClientRect();
            const newX = event.clientX - boundingRect.left - size.width / 2;
            const newY = event.clientY - boundingRect.top - size.height / 2;

            const constrainedX = Math.max(0, Math.min(newX, boundingRect.width - size.width));
            const constrainedY = Math.max(0, Math.min(newY, boundingRect.height - size.height));

            setPosition({
                x: constrainedX,
                y: constrainedY,
            });

            drawCropArea(constrainedX, constrainedY);
        }
    };

const drawImageOnCanvas = () => {
    if (image && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        imgRef.current.src = image;
        imgRef.current.onload = () => {
            const container = document.querySelector('.image-crop-area');
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;

            let imgWidth, imgHeight;

            // Ajuste de imagem para cobrir o canvas adequadamente
            if (imgRef.current.width / imgRef.current.height > 16 / 9) {
                // Imagem é mais larga, ajuste para a altura
                imgHeight = containerHeight;
                imgWidth = imgRef.current.width * (imgHeight / imgRef.current.height);
            } else {
                // Imagem é mais alta, ajuste para a largura
                imgWidth = containerWidth;
                imgHeight = imgRef.current.height * (imgWidth / imgRef.current.width);
            }

            setScaledImageSize({ width: imgWidth, height: imgHeight });

            canvas.width = imgWidth;
            canvas.height = imgHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgRef.current, 0, 0, imgWidth, imgHeight);

            // Definir tamanho de corte 16:9 respeitando os limites da imagem
            const cropWidth = Math.min(imgWidth, imgHeight * (16 / 9));
            const cropHeight = cropWidth / (16 / 9);
            setSize({ width: cropWidth, height: cropHeight });

            const centerX = (imgWidth - cropWidth) / 2;
            const centerY = (imgHeight - cropHeight) / 2;
            setPosition({ x: centerX, y: centerY });

            drawCropArea(centerX, centerY);
        };
    }
};

    const drawCropArea = (x, y) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgRef.current, 0, 0, scaledImageSize.width, scaledImageSize.height);

        ctx.strokeStyle = '#39aee1';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.strokeRect(x, y, size.width, size.height);
    };

    const handleCrop = () => {
        const canvas = canvasRef.current;
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');

        const scaleX = imageSize.width / scaledImageSize.width;
        const scaleY = imageSize.height / scaledImageSize.height;

        croppedCanvas.width = size.width * scaleX;
        croppedCanvas.height = size.height * scaleY;

        croppedCtx.drawImage(
            imgRef.current,
            position.x * scaleX, position.y * scaleY, size.width * scaleX, size.height * scaleY,
            0, 0, size.width * scaleX, size.height * scaleY
        );

        const croppedImageDataURL = croppedCanvas.toDataURL('image/png');
        onImageUpload(croppedImageDataURL);
    };

    useEffect(() => {
        if (image) {
            imgRef.current.src = image;
            imgRef.current.onload = () => {
                setImageSize({ width: imgRef.current.width, height: imgRef.current.height });
                drawImageOnCanvas();
            };
        }
    }, [image]);

    useEffect(() => {
        if (image && scaledImageSize.width && scaledImageSize.height) {
            const cropWidth = Math.min(scaledImageSize.width, scaledImageSize.height * (16 / 9));
            const cropHeight = cropWidth / (16 / 9);
            setSize({ width: cropWidth, height: cropHeight });
            const centerX = (scaledImageSize.width - cropWidth) / 2;
            const centerY = (scaledImageSize.height - cropHeight) / 2;
            setPosition({ x: centerX, y: centerY });
            drawCropArea(centerX, centerY);
        }
    }, [scaledImageSize, image]);

    const squareSize = 10;

    if (!isVisible) {
        return null;
    }

    return (
        <div className="image-crop-preview-container">
            <div className='image-edit-title'><p>Editar imagem</p></div>
            <div className='canvas-container'>
                {image && (
                    <div
                        className="image-crop-area"
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        style={{
                            position: 'relative',
                            width: '500px',
                            height: 'auto',
                        }}
                    >
                        <canvas
                            ref={canvasRef}
                            style={{
                                display: 'block',
                                width: '500px',
                                maxWidth: '500px',
                                height: 'auto',
                                border: 'none',
                            }}
                        />
                        <div
                            className='canvas-squares'
                            style={{
                                position: 'absolute',
                                width: squareSize,
                                height: squareSize,
                                left: position.x - squareSize / 2,
                                top: position.y - squareSize / 2,
                                cursor: 'nwse-resize',
                            }}
                        />
                        <div
                            className='canvas-squares'
                            style={{
                                position: 'absolute',
                                width: squareSize,
                                height: squareSize,
                                left: position.x + size.width - squareSize / 2,
                                top: position.y - squareSize / 2,
                                cursor: 'nesw-resize',
                            }}
                        />
                        <div
                            className='canvas-squares'
                            style={{
                                position: 'absolute',
                                width: squareSize,
                                height: squareSize,
                                left: position.x - squareSize / 2,
                                top: position.y + size.height - squareSize / 2,
                                cursor: 'nesw-resize',
                            }}
                        />
                        <div
                            className='canvas-squares'
                            style={{
                                position: 'absolute',
                                width: squareSize,
                                height: squareSize,
                                left: position.x + size.width - squareSize / 2,
                                top: position.y + size.height - squareSize / 2,
                                cursor: 'nwse-resize',
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="controls-edit">
                <button onClick={onClose} className='btn-white'>Cancelar</button>
                <button onClick={handleCrop} className='btn-blue'>Pronto</button>
            </div>
        </div>
    );
};

export default BannerCropPreview;
