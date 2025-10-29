import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BookDetail from './pages/BookDetail'
import Library from './pages/Library'
import Profile from './pages/Profile'
import Reader from './pages/Reader'
import WriteReview from './pages/WriteReview'
import Discover from './pages/Discover'
import UploadBook from './pages/UploadBook'
import BottomNav from './components/common/BottomNav'
import EditBook from './pages/EditBook'

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-cream-50 pb-16 md:pb-0'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/book/:id' element={<BookDetail />} />
          <Route path='/library' element={<Library />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/read/:id' element={<Reader />} />
          <Route path='/write-review/:bookId' element={<WriteReview />} />
          <Route path='/edit-book/:id' element={<EditBook />} />
          <Route path='/discover' element={<Discover />} />
          <Route path='/upload-book' element={<UploadBook />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App
