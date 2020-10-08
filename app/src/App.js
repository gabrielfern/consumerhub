/* global localStorage */

import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { getUser, getNotifications } from './services/api'
import Header from './components/Header'
import Page from './components/Page'
import Footer from './components/Footer'

export default () => {
  const [user, setUser] = useState()
  const [isLogged, setIsLogged] = useState(!!localStorage.token)
  const [notifications, setNotifications] = useState([])

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

  const loadNotifications = useCallback(async () => {
    if (isLogged) {
      const notifications = await getNotifications()
      setNotifications(notifications)
    }
  }, [isLogged])

  function logout () {
    delete localStorage.token
    setUser()
    setIsLogged(false)
  }

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const childProps = {
    user, isLogged, loadUser, logout, notifications, loadNotifications
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
