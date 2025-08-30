import { useEffect, useState } from 'react';
import './App.css'
import Sign from './components/auth';
import TaskManager from './components/task-manager';
import { supabase } from './assets/supabase-client';

function App() {

  const [session, setSession] = useState(null);

  const fetchSession = async () => {
    const { data: currentSession } = await supabase.auth.getSession();

    setSession(currentSession);
    console.log(currentSession);
    
  }

  const logout = async () => {
    const {error} = await supabase.auth.signOut();
    
    if(error) {
      console.error("Error signing out", error.message);
      return;
    }

    setSession(null);
  }

  useEffect(() => {
    fetchSession();
  }, [])

  return (
    <>
      {session ? (
        <>
          <button onClick={logout}>Logout</button>
          <TaskManager />
        </>
      ) : <Sign />}
    </>
  )
}

export default App
