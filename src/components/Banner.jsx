import React from 'react'
import { useEffect, useState } from 'react';
import api from '../api';

function Banner() {


    return(
        <>
        <div className="taskheader">
        <div className='banner-overlay'></div>
        <div className='content-container'>
        <h1 className='content-h1'>Heróis em Ação</h1>
        <p className='content-p'>Mostre seu talento e participe do nosso desafio de arte! Solte sua imaginação e crie uma obra inspirada no tema "Heróis". Seja qual for sua visão de heroísmo, queremos ver! Inscreva-se e compartilhe sua arte com a comunidade. As melhores criações terão destaque especial em nosso site. Aceite o desafio e inspire-se!</p>
        </div>
        <div className='container-btns'>
         <button className='btn-banner'>Ver Detalhes</button>
        </div>
      </div>
      <div className='feed-title'></div>
      </>
    )
}

export default Banner