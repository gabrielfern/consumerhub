/* global gapi */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { checkLoggedUser, login, gLogin } from '../redux/actions'

function Signin (props) {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (props.logged) {
      history.push('/profile')
    } else {
      props.dispatch(checkLoggedUser())
    }
  }, [props, history])

  async function submit () {
    props.dispatch(login(email, password))
  }

  useEffect(() => {
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init()
      gapi.signin2.render('g-signin2', {
        onsuccess: async () => {
          const gUser = auth2.currentUser.get()
          props.dispatch(gLogin(gUser))
          auth2.signOut()
        }
      })
    })
  }, [props, history])

  return (
    <div className='container my-3'>
      <h1>Logue</h1>
      <p>
        <button className='btn btn-secondary m-2' onClick={() => history.push('/signup')}>
            Cadastrar
        </button>
      </p>
      <p>
        <span><b>Email </b></span>
        <input
          className='form-control' type='text'
          value={email} onChange={e => setEmail(e.target.value)}
        />
      </p>
      <p>
        <span><b>Senha </b></span>
        <input
          className='form-control' type='password'
          value={password} onChange={e => setPassword(e.target.value)}
        />
      </p>
      <p>
        <button className='btn btn-primary m-2' onClick={submit}>Entrar</button>
      </p>
      <div id='g-signin2' />
    </div>
  )
}

export default connect(state => state)(Signin)
