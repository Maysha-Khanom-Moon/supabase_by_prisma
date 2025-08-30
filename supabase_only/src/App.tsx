import { useEffect, useState } from 'react';
import './App.css'
import Sign from './components/auth';
import TaskManager from './components/task-manager';
import { supabase } from './assets/supabase-client';
import type { Session } from '@supabase/supabase-js';

function App() {

  const [session, setSession] = useState<Session | null>(null);

  const fetchSession = async () => {
    const { data: currentSession } = await supabase.auth.getSession();

    setSession(currentSession.session);
    console.log(currentSession.session);
    
  }

  const logout = async () => {
    const {error} = await supabase.auth.signOut();
    
    if(error) {
      console.error("Error signing out", error.message);
      return;
    }

    fetchSession();
  }

  useEffect(() => {
    fetchSession();

    const {data} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      data.subscription.unsubscribe();
    }
  }, [])

  return (
    <>
      {session ? (
        <>
          <button onClick={logout}>Logout</button>
          <TaskManager session={session}/>
        </>
      ) : <Sign />}
    </>
  )
}

export default App
