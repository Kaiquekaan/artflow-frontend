import React from 'react'
import { useEffect, useState } from 'react';
import api from '../../api';
import ListPost from './ListPost';
import './Feed.css'

function Feed() {


    return(
     <div className='feed-container'>
      <ListPost endpoint="/api/posts/"  method={'GET'}/>
      </div>
    )
}

export default Feed