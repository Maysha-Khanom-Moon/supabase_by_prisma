import './App.css'
import Sign from './components/auth';
import TaskManager from './components/task-manager';

function App() {

  return (
    <>
      <TaskManager />

      {/* sign in/ sign out section */}
      <Sign />
    </>
  )
}

export default App
