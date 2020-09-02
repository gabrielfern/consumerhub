import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header'
import Page from './components/Page'
import Footer from './components/Footer'

export default () => {
  const [user, setUser] = useState()

  return (
    <div className='d-flex flex-column min-vh-100'>
      <BrowserRouter>
        <Header user={user} setUser={setUser} />
        <Page user={user} setUser={setUser} />
        <Footer />
      </BrowserRouter>
    </div>
  )
}
