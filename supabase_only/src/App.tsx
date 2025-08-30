import { useEffect, useState } from 'react';
import './App.css'
import Sign from './components/auth';
import TaskManager from './components/task-manager';
import { supabase } from './assets/supabase-client';

function App() {

  const [session, setSession] = useState(null);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();

    setSession(currentSession.data);
    console.log(currentSession);
    
  }

  useEffect(() => {
    fetchSession();
  }, [])

  return (
    <>
      {session ? (
        <button>Logout</button>
        <TaskManager /> 
      ) : <Sign />}
    </>
  )
}

export default App
