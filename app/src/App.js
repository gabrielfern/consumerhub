import React from 'react'
import Header from './components/Header'
import Page from './components/Page'
import Footer from './components/Footer'

export default () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Header />
      <Page />
      <Footer />
    </div>
  )
}
