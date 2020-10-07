/* global localStorage */

import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { getUser } from './services/api'
import Header from './components/Header'
import Page from './components/Page'
import Footer from './components/Footer'

export default () => {
  const [user, setUser] = useState()
  const [isLogged, setIsLogged] = useState(!!localStorage.token)

  const loadUser = useCallback(async () => {
    try {
      if (localStorage.token) {
        const user = await getUser()
        setUser(user)
        setIsLogged(true)
      } else {
        logout()
      }
    } catch {
      logout()
    }
  }, [])

  function logout () {
    delete localStorage.token
    setUser()
    setIsLogged(false)
  }

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const childProps = {
    user, isLogged, loadUser, logout
  }

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
