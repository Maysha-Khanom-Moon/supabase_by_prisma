import { useState, type FormEvent } from 'react'
import './App.css'
import { supabase } from './assets/supabase-client';

function App() {

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
          <li
            style={{ 
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '1rem',
              marginBottom: '0.5rem',
            }}
          >
            <div>
              <h3>Title</h3>
              <p>Description</p>
              <div>
                <button style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>
                  Edit
                </button>
                <button style={{ padding: '0.5rem 1rem' }}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}

export default App
