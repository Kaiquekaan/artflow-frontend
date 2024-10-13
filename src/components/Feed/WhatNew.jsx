import React from 'react'
import { useEffect, useState } from 'react';
import api from '../../api';

import './Feed.css'

function WhatNew() {


    return(
     <div className='whatnew-container'>
       <div className='whatnew-title'>
        <p>O que tem de novo?</p>
       </div>
       <div className='whatnew-content'>    
       </div>
      </div>
    )
}

export default WhatNew