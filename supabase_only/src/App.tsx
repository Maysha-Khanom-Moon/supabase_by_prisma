import { useEffect, useState, type FormEvent } from 'react'
import './App.css'
import { supabase } from './assets/supabase-client';

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

function App() {

  // delete task from database
  const deleteTask = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if(error) {
      console.error("Error deleting task", error.message);
      return;
    }

    fetchTasks();
  }

  // fetch all tasks from database
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const { error, data } = await supabase.from('tasks').select('*').order('created_at', { ascending: true });

    if(error) {
      console.error("Error fetching tasks", error.message);
      return;
    }

    setTasks(data);
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  // add new task to database
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('tasks').insert({
      title: newTask.title,
      description: newTask.description
    }).single();

    if(error) {
      console.error("Error adding task", error.message);
      return;
    }

    setNewTask({
      title: '',
      description: '',
    })
  }

  return (
    <>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem'}}>
        <h2>Task Manager CRUD</h2>

        {/* form to add a new task */}
        <form style={{ marginBottom: '1rem' }} action="">
          <input 
            type="text"
            placeholder='Task Title'
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
          />
          <textarea
            placeholder='Task Description'
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
          />
          <button type='submit' onClick={handleSubmit} style={{ padding: '0.5rem 1rem' }}>
            Add Task
          </button>
        </form>

        {/* list of tasks */}
        <ul style={{ listStyle: 'none', padding: '0', margin: '0'}}>
          {tasks.map((task) => (
            
            <li
              style={{ 
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div>
                  <button style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>
                    Edit
                  </button>
                  <button onClick={(e) => deleteTask(e, task.id)} style={{ padding: '0.5rem 1rem' }}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
