import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { checkLoggedUser, login } from '../redux/actions'
import { connect } from 'react-redux'

function Signin (props) {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (props.logged) {
    history.push('/profile')
  } else {
    props.dispatch(checkLoggedUser())
  }

  async function submit () {
    props.dispatch(login(email, password))
  }

  /*   useEffect(() => {
    async function gSignIn (gUser) {
      const idToken = gUser.getAuthResponse().id_token
      const { token, isNewUser } = await gauthUser(idToken)
      if (token) {
        localStorage.token = token
        if (isNewUser) {
          const imageUrl = gUser.getBasicProfile().getImageUrl()
          const resp = await fetch(imageUrl)
          await uploadUserImage(await resp.arrayBuffer())
        }
        history.push('/profile')
      }
    }

    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init()
      gapi.signin2.render('g-signin2', {
        onsuccess: async () => {
          const gUser = auth2.currentUser.get()
          await gSignIn(gUser)
          auth2.signOut()
        }
      })
    })
  }, [history]) */

  return (
    <div className='container my-3'>
      <h1>Logue</h1>
      <p>
        <button className='btn btn-secondary m-2' onClick={() => history.push('/signup')}>Cadastrar</button>
      </p>
      <p>
        <span><b>Email </b></span>
        <input className='form-control' type='text' value={email} onChange={e => setEmail(e.target.value)} />
      </p>
      <p>
        <span><b>Senha </b></span>
        <input className='form-control' type='password' value={password} onChange={e => setPassword(e.target.value)} />
      </p>
      <p>
        <button className='btn btn-primary m-2' onClick={submit}>Entrar</button>
      </p>
      <div id='g-signin2' />
    </div>
  )
}

export default connect(state => state)(Signin)
