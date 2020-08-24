import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { checkLoggedUser, signup } from '../redux/actions'

function Signup (props) {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState({})

  useEffect(() => {
    if (props.logged) {
      history.push('/profile')
    } else {
      props.dispatch(checkLoggedUser())
    }
  }, [props, history])

  async function submit () {
    props.dispatch(signup(name, email, password, image))
  }

  return (
    <div className='container my-3'>
      <h1>Inscreva-se</h1>
      <p>
        <button className='btn btn-secondary m-2' onClick={() => history.push('/')}>
          Logar
        </button>
      </p>
      <p>
        <span><b>Nome </b></span>
        <input
          className='form-control' type='text'
          value={name} onChange={e => setName(e.target.value)}
        />
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
      <div className='custom-file my-3'>
        <input
          type='file' className='custom-file-input'
          onChange={e => {
            const fileLabel = document.getElementById('fileLabel')
            if (e.target.files[0]) {
              fileLabel.innerText = e.target.files[0].name
            } else {
              fileLabel.innerText = 'Escolha a imagem'
            }
            setImage(e.target.files[0])
          }}
        />
        <label id='fileLabel' className='custom-file-label'>Escolha a imagem</label>
      </div>
      <p>
        <button className='btn btn-primary m-2' onClick={submit}>Confirmar</button>
      </p>
    </div>
  )
}

export default connect(state => state)(Signup)
