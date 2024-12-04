import React, { useState, useRef } from 'react';

function VerificationCodeInput({ length, onComplete }) {
    const [code, setCode] = useState(Array(length).fill("")); 
    const inputsRef = useRef([]);

    // Lida com a alteração em cada `input`
    const handleChange = (value, index) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Passa para o próximo campo automaticamente, se houver
        if (value && index < length - 1) {
            inputsRef.current[index + 1].focus();
        }

        // Chama onComplete quando todos os dígitos forem preenchidos
        if (newCode.every((digit) => digit !== "") && newCode.length === length) {
            setCode(newCode); // Garante que o estado é atualizado
            onComplete(newCode.join(""));
        }
    };

    // Lida com a tecla "Backspace" para voltar ao input anterior
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code[index]}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputsRef.current[index] = el)}
                    className='input-verify-code'
                    style={{
                        width: '60px',
                        height: '60px',
                        fontSize: '24px',
                        textAlign: 'center',
                        borderRadius: '10px',
                    }}
                />
            ))}
        </div>
    );
}

export default VerificationCodeInput;
