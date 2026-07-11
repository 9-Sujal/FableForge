import {Routes, Route} from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';
import Container from './components/common/Container';
import AuthorPage from './views/AuthorPage';



const Cart = lazy(()=> import("./views/Cart"))
const Payment = lazy(()=>import("./views/Payment"))

const Orders = lazy(()=> import("./views/Orders"))

const SingleBook = lazy(() => import("./views/SingleBook"));
const ReadingPage = lazy(() => import("./views/ReadingPage"));
const ReviewForm = lazy(() => import("./views/ReviewForm"));
const Home = lazy(() => import("./views/Home"));
const SignUp = lazy(() => import("./views/SignUp"));
// const Verify = lazy(() => import("./views/Verify"));
const NewUser = lazy(() => import("./views/NewUser"));
const NotFound = lazy(() => import("./views/NotFound"));
const SignIn = lazy(() => import("./views/SignIn"));
const SetPassword = lazy(() => import("./views/SetPassword"));
const Profile = lazy(() => import("./views/Profile"));
const UpdateProfile = lazy(() => import("./views/UpdateProfile"));
const UpdateAuthor = lazy(() => import("./views/UpdateAuthor"));
const NewAuthorRegistration = lazy(() => import("./views/NewAuthorRegistration"));
const UpdateBookForm = lazy(() => import("./views/UpdateBookForm"));
const NewBookForm = lazy(() => import("./views/NewBookForm"));
const Search = lazy(() => import("./views/Search"));
const Library = lazy(() => import("./views/Library"));
const Private = lazy(() => import("./routes/Private"));
const Guest = lazy(() => import("./routes/Guest"));
const Author = lazy(() => import("./routes/Author"));


function App() {
   return (
    <Container>
      <Suspense fallback={<LoadingSpinner/>} >
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/search' element={<Search/>}/>
      <Route path="/sign-up" element={<SignUp/>} />
       <Route path="/sign-in" element={<SignIn/>} />
       {/* <Route path="/verify" element={<Verify/>} /> */}
        <Route path="/set-password" element={<SetPassword/>} />
 <Route path="/cart" element={<Cart />} />
       <Route path="/book/:slug" element={<SingleBook />} />
      <Route path="/author/:id" element={<AuthorPage />} />
        <Route path="/not-found" element={<NotFound />} />

        <Route element={<Private/>} >
  <Route path="/profile" element={<Profile/>} />
   <Route path="/new-user" element={<NewUser/>} />
   <Route path="/update-profile" element={<UpdateProfile />} />
   <Route path="/library" element={<Library />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payment-success" element={<Payment />} />
    <Route path="/read/:slug" element={<ReadingPage />} />
   <Route path="/rate/:bookId" element={<ReviewForm />} />
    <Route
            path="/author-registration"
            element={<NewAuthorRegistration />}
          />
    
   <Route element={<Author />}>
            <Route path="/update-author" element={<UpdateAuthor />} />
            <Route path="/create-new-book" element={<NewBookForm />} />
            <Route path="/update-book/:slug" element={<UpdateBookForm />} />
            
          </Route>
        </Route>

       <Route element={<Guest />}>
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </Container>
  )
}

export default App
