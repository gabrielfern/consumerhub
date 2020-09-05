/* global localStorage */

import React, { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { getUser } from './services/api'
import Header from './components/Header'
import Page from './components/Page'
import Footer from './components/Footer'

export default () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    (async () => {
      try {
        if (localStorage.token) {
          const user = await getUser()
          setUser(user)
        } else {
          setUser()
        }
      } catch {
        delete localStorage.token
        setUser()
      }
    })()
  }, [setUser])

  const isLogged = () => user && user.id
  const childProps = { user, setUser, isLogged }

  return (
    <div className='d-flex flex-column min-vh-100'>
      <BrowserRouter>
        <Header {...childProps} />
        <Page {...childProps} />
        <Footer />
      </BrowserRouter>
    </div>
  )
}
