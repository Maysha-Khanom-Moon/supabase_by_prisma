import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../assets/supabase-client';
import type { Session } from '@supabase/supabase-js';
interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  image_url: string;
}

const TaskManager = ({session}: {session: Session | null}) => {

  // image upload
  const [taskImage, setTaskImage] = useState<File | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {

    const filePath = `image/${file.name}-${Date.now()}`;

    const { error } = await supabase.storage.from('tasks-images').upload(filePath, file);

    if (error) {
      console.error("Error uploading image", error.message);
      return null;
    }

    const { data } = await supabase.storage.from('tasks-images').getPublicUrl(filePath);

    return data.publicUrl;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setTaskImage(file);
    }
  }

  // supabase subscription for real-time updates
  useEffect( () => {
    const channel = supabase
    .channel('tasks-channel')
    .on(
      'postgres_changes', 
      {event: 'INSERT', schema: 'public', table: 'tasks'}, 
      (payload) => {
        const newTask = payload.new as Task;
        setTasks((prev) => [...prev, newTask]);
      }).subscribe(( status ) => {
        console.log("Subscription status" ,status);
        
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

    // update task in database
  const [newDescription, setNewDescription] = useState('');

  const updateTask = async (e: React.MouseEvent<HTMLButtonElement>,id: number) => {
    e.preventDefault();

    const { error } = await supabase.from('tasks').update({ description: newDescription }).eq('id', id);

    if(error) {
      console.error("Error updating task", error.message);
      return;
    }

    fetchTasks();
  }

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
    image_url: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // upload image before add to the task
    let imageUrl = '';
    if(taskImage) {
      imageUrl = (await uploadImage(taskImage)) ?? '';
    }

    // email added for security
    const { error } = await supabase.from('tasks').insert({...newTask, email: session?.user.email, image_url: imageUrl}).single();

    if(error) {
      console.error("Error adding task", error.message);
      return;
    }

    setNewTask({
      title: '',
      description: '',
      image_url: ''
    })

    fetchTasks();
  }

  return (
    <div>
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

          {/* add image */}
          <input type="file" accept='image/*' onChange={handleFileChange} />

          <button type='submit' onClick={handleSubmit} style={{ padding: '0.5rem 1rem' }}>
            Add Task
          </button>
        </form>

        {/* list of tasks */}
        <ul style={{ listStyle: 'none', padding: '0', margin: '0'}}>
          {tasks.map((task) => (
            
            <li 
              key={task.id}
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
                <img  src={task.image_url} alt={task.title} style={{ height: '100px', marginBottom: '0.5rem' }}/>
                <div>

                  {/* textarea to update task */}
                  <textarea 
                  placeholder='Updated description...'
                  onChange={ (e) => setNewDescription(e.target.value) }
                  style={{ 
                      width: '100%', 
                      marginBottom: '0.5rem', 
                      padding: '0.5rem' 
                    }} 
                  />
                  <button onClick={(e) => updateTask(e, task.id)} style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>
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
    </div>
  )
}

export default TaskManager
