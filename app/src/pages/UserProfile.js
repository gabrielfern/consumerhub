import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Image from '../components/Image'
import Reviews from '../components/profile/Reviews'
import { getUser } from '../services/api'
import { ReactComponent as EmailSVG } from '../assets/email.svg'

export default (props) => {
  const [user, setUser] = useState()
  const { userId } = useParams()
  const history = useHistory()

  useEffect(() => {
    if (props.isLogged && props.user) {
      if (props.user.id === userId) {
        history.replace('/profile')
      } else {
        getUser(userId).then(user => {
          setUser(user)
        })
      }
    } else if (!props.isLogged) {
      getUser(userId).then(user => {
        setUser(user)
      })
    }
  }, [userId, props.isLogged, props.user, history])

  return (
    <>
      <h1>Perfil de usuário</h1>

      {user &&
        <div className='d-md-flex justify-content-center'>
          <div className='d-flex flex-column align-items-center word-break'>
            <div style={{ width: '250px' }}>
              <Image
                width='250px'
                src={`/api/images/${user.image}`}
              />
              <p className='mt-3'>
                <span className='text-muted'>#{user.id + ' '}</span>
                {user.type !== 'user' &&
                  <Badge variant='secondary'>{user.type}</Badge>}
              </p>
              <p className='mt-3'><b>{user.name}</b></p>
              {user.email &&
                <p className='mt-3'>
                  <EmailSVG /> {user.email}
                </p>}
            </div>
          </div>

          <div className='flex-fill d-flex flex-column mx-3'>
            <h4>Avaliações</h4>
            <Reviews user={user} />
          </div>
        </div>}
    </>
  )
}
