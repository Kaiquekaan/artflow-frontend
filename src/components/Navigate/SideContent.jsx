import React from 'react'
import { useEffect, useState } from 'react';
import api from '../../api';
import './SideContent.css'
import Friends from '../Feed/Friends';
import WhatNew from '../Feed/WhatNew';

function SideContent({page}) {


    return(
     <div className='sidecontent-container'>
            <div
                className={`Logo-container`}
                onClick={() => handleTabClick('')}
            >
                 <a className="sidebar-brand"><img src='https://raw.githubusercontent.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/feature-login/src/imagens/Af_logo_mini.webp' alt="Logo"  /> </a>
                 <a className="sidebar-brand"><img src='https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/master/src/imagens/artflow_written.png?raw=true' alt="Logo"  /> </a>
          </div>
          <div className='sidecontent-content'>
          {page === 'feed' ? (
            <>
             <Friends/>
             <WhatNew/>
            </>
          ): ''}
             
          </div>
      </div>
    )
}

export default SideContent