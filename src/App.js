import './App.css';
import List from './components/List';
import React, { useState } from 'react';

function App() {
  const [link, setLink] = useState('');

  return (
    <div className='App'>
      <input
        className='link'
        type="text"
        name='input1'
        placeholder='Link GitHub Repo'
        value={link}
        onChange={(event) => setLink(event.target.value)}
      />
      {link.split('/').length === 5 &&
        (<List link={link} />)
      }


    </div>
  )

}

export default App;
