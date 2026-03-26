import {Routes, Route} from 'react-router-dom';
import Home from './views/Home';
import SignUp from './views/SignUp';
import Container from './components/common/Container';
import Verify from './views/Verify';
import NewUser from './views/NewUser';
import NotFound from './views/NotFound';


function App() {
   return (
    <Container>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/sign-up" element={<SignUp/>} />
       <Route path="/verify" element={<Verify/>} />
       <Route path="/new-user" element={<NewUser/>} />
        <Route path="/not-found" element={<NotFound />} />
      </Routes>
    </Container>
  )
}

export default App
