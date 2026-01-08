import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Store from './components/Store';
import './App.css';

function App() {
  // functions and const

  return (
    <>
    <div className='bg-teal-100'>
    <main className='w-[1200px] max-w-full m-auto p-5'>
      <Store />
    </main>
    </div>  
    </>
  )
}

export default App
