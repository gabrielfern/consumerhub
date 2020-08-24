import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getUser, logout } from '../redux/actions'
import { connect } from 'react-redux'

function Profile (props) {
  const history = useHistory()

  let userInfo
  if (props.logged && props.user) {
    userInfo = (
      <>
        <p><b>ID:</b> {props.user.id}</p>
        <p><b>Nome:</b> {props.user.name}</p>
        <p><b>Email:</b> {props.user.email}</p>
      </>
    )
  } else {
    userInfo = <>Loading...</>
  }

  useEffect(() => {
    if (!props.logged) {
      history.push('/')
    } else if (!props.user) {
      props.dispatch(getUser())
    }
  }, [props, history])

  return (
    <div className='container my-3'>
      <div>
        <h1>Perfil de usuário</h1>
        <p>
          <button className='btn btn-secondary m-2' onClick={() => props.dispatch(logout())}>Deslogar</button>
        </p>
        {userInfo}
      </div>
      <div>
        {props.user &&
          <img
            src={`/api/users/${props.user.id}/image`} alt='imagem de usuário'
            style={{ display: 'block', maxWidth: '100%' }}
          />}
      </div>
    </div>
  )
}

export default connect(state => state)(Profile)
