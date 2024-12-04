import React from 'react'
import { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate, } from 'react-router-dom';

import './Feed.css'

function WhatNew() {
    const [trendingTopics, setTrendingTopics] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchFriends = async () => {
        try {
          const response = await api.get('/api/trending-hashtags/');
          console.log('Resposta da API:', response.data);
          setTrendingTopics(response.data.recommended_topics || []);
          setLoading(false);
        } catch (error) {
          console.error('Erro ao buscar amigos:', error);
          setLoading(false);
        }
      };
  
      fetchFriends();
    }, []);

    const handleSearch = (query) => {
      navigate(`/t?q=${encodeURIComponent(query)}`);
  };

    if (loading ) {
      return <div className='whatnew-container'>
      <div className='whatnew-title loading'>
       <p></p>
      </div>
      <div className='whatnew-content'>    
      <div className='topic-container'>
      {Array.from({ length: 5 }).map((_, index) => {
        const randomWidth = Math.floor(Math.random() * 21) + 60;
        return (
        <div className='topic-line loading' key={index}><p  style={{ width: `${randomWidth}%`, animationDelay: `${index * 0.2}s` }}>.</p></div>
      );
      })}
   </div>

      </div>
     </div>

    }

    console.log('tradingtopics: ', trendingTopics)
    return(
     <div className='whatnew-container'>
       <div className='whatnew-title'>
        <p>O que tem de novo?</p>
       </div>
       <div className='whatnew-content'>    
       <div className='topic-container'>
    {trendingTopics.map((hashtag, index) => (
        <div className='topic-line' key={index} onClick={() => handleSearch(hashtag)}>{hashtag}</div>
        
    ))}
    </div>

       </div>
      </div>
    )
}

export default WhatNew