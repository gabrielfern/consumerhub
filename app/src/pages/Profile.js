import React, { useEffect } from 'react'
import { Switch, Route, useHistory, Link, useLocation } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Badge from 'react-bootstrap/Badge'
import Image from '../components/Image'
import Reviews from '../components/profile/Reviews'
import Staging from '../components/profile/Staging'
import Friends from '../components/profile/Friends'
import { ReactComponent as EmailSVG } from '../assets/email.svg'

export default (props) => {
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search)

  useEffect(() => {
    if (!props.isLogged) {
      history.push('/signin')
    }
  }, [history, props.isLogged])

  return (
    <>
      <h1>Perfil de usuário</h1>

      {(props.user &&
        <div className='d-md-flex justify-content-center'>
          <div className='d-flex flex-column align-items-center word-break mb-3'>
            <div style={{ width: '250px' }}>
              <Image
                width='250px'
                src={`/api/images/${props.user.image}`}
              />
              <p className='mt-3'>
                <span className='text-muted'>#{props.user.id}&nbsp;</span>
                {props.user.type !== 'user' &&
                  <Badge variant='secondary'>{props.user.type}</Badge>}
              </p>
              <p className='mt-3'><b>{props.user.name}</b></p>
              <p className='mt-3'>
                <EmailSVG /> {props.user.email}
              </p>
            </div>
          </div>

          <div className='flex-fill d-flex flex-column mx-3'>
            <Nav variant='tabs' className='mb-3' activeKey={query.get('tab') || 'reviews'}>
              <Nav.Item>
                <Nav.Link as={Link} to='/profile' eventKey='reviews'>
                  Avaliações
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to='/profile?tab=staging' eventKey='staging'>
                  Produtos em análise
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to='/profile?tab=friends' eventKey='friends'>
                  Amigos
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Switch location={{ pathname: query.get('tab') || 'reviews' }}>
              <Route exact path='reviews'>
                <Reviews {...props} />
              </Route>
              <Route exact path='staging'>
                <Staging {...props} />
              </Route>
              <Route exact path='friends'>
                <Friends {...props} />
              </Route>
            </Switch>
          </div>
        </div>) || <p>Carregando...</p>}
    </>
  )
}
