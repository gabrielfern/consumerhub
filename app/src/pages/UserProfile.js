import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import Image from '../components/Image'
import Reviews from '../components/profile/Reviews'
import Report from '../components/Report'
import {
  getUser, getFriendshipWith, addFriend as addFriendAPI,
  deleteFriend, acceptFriend as acceptFriendAPI,
  deleteUser as deleteUserAPI, changeUserType as changeUserTypeAPI
} from '../services/api'
import { ReactComponent as EmailSVG } from '../assets/email.svg'
import { ReactComponent as InfoSVG } from '../assets/info.svg'

export default (props) => {
  const { userId } = useParams()
  const history = useHistory()
  const [user, setUser] = useState()
  const [friendship, setFriendship] = useState()
  const [showReportModal, setShowReportModal] = useState(false)

  const loadUser = useCallback(() => {
    getUser(userId).then(user => {
      setUser(user)
    })
  }, [userId])

  const loadFriendship = useCallback(() => {
    if (props.isLogged) {
      getFriendshipWith(userId).then(friendship => {
        setFriendship(friendship)
      })
    }
  }, [props.isLogged, userId])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useEffect(() => {
    loadFriendship()
  }, [loadFriendship])

  async function addFriend () {
    await addFriendAPI(user.id)
    loadFriendship()
    loadUser()
  }

  async function acceptFriend () {
    await acceptFriendAPI(user.id)
    loadFriendship()
    loadUser()
  }

  async function remFriend () {
    await deleteFriend(user.id)
    loadFriendship()
    loadUser()
  }

  async function deleteUser () {
    if (window.confirm('Realmente excluir esse usuário?')) {
      const status = await deleteUserAPI(user.id)
      if (status === 200) {
        history.goBack()
      } else {
        window.alert('Falha ao excluir usuário')
      }
    }
  }

  async function changeUserType (type) {
    await changeUserTypeAPI(user.id, type)
    loadUser()
  }

  return (
    <>
      <h1>Perfil de usuário</h1>

      {user &&
        <div className='d-md-flex justify-content-center'>
          <div className='d-flex flex-column align-items-center word-break mb-3'>
            <div style={{ width: '250px' }}>
              <Image
                width='250px'
                src={`/api/images/${user.image}`}
              />
              <div className='mt-3 d-flex align-items-center'>
                <span className='text-muted'>#{user.id}&nbsp;</span>
                {user.type !== 'user' &&
                  <Badge variant='secondary'>{user.type}</Badge>}
                <div className='flex-fill text-right'>
                  {props.user && props.user.id !== user.id &&
                    <Dropdown alignRight>
                      <Dropdown.Toggle
                        className='border-0'
                        variant='outline-dark'
                      />
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setShowReportModal(true)}>
                          Reportar
                        </Dropdown.Item>
                        {props.user.type !== 'user' &&
                          <Dropdown.Item
                            className='text-danger'
                            onClick={deleteUser}
                          >
                            Excluir Usuário
                          </Dropdown.Item>}
                      </Dropdown.Menu>
                    </Dropdown>}
                </div>
              </div>
              <p className='mt-3'><b>{user.name}</b></p>
              {user.email &&
                <p className='mt-3'>
                  <EmailSVG /> {user.email}
                </p>}
              {props.user && props.user.id !== user.id &&
                <div
                  className='d-flex justify-content-between align-items-center flex-wrap'
                >
                  {!friendship &&
                    <>
                      <Button
                        variant='outline-primary'
                        onClick={addFriend}
                      >
                          Adicionar amigo
                      </Button>
                      <OverlayTrigger
                        placement='top'
                        overlay={
                          <Tooltip>
                              Amigos podem ver o email um do outro
                          </Tooltip>
                        }
                      >
                        <span>&nbsp;<InfoSVG /></span>
                      </OverlayTrigger>
                    </>}
                  {friendship && !friendship.accepted &&
                      friendship.userId1 === user.id &&
                        <>
                          <Button
                            className='m-1'
                            variant='outline-primary'
                            onClick={acceptFriend}
                          >
                          Aceitar amigo
                          </Button>
                          <Button
                            className='m-1'
                            variant='outline-danger'
                            onClick={remFriend}
                          >
                          Recusar amigo
                          </Button>
                        </>}
                  {friendship && !friendship.accepted &&
                      friendship.userId2 === user.id &&
                        <>
                          <Button
                            className='m-1'
                            variant='outline-secondary'
                            onClick={remFriend}
                          >
                          Cancelar pedido
                          </Button>
                        </>}
                  {friendship && friendship.accepted &&
                    <>
                      <Button
                        className='m-1'
                        variant='outline-secondary'
                        onClick={remFriend}
                      >
                          Desfazer amizade
                      </Button>
                    </>}
                  {props.user.type === 'admin' &&
                    <Form.Control
                      className='my-3'
                      as='select' custom defaultValue={user.type}
                      onChange={e => changeUserType(e.target.value)}
                    >
                      <option value='user'>Usuário</option>
                      <option value='mod'>Moderador</option>
                      <option value='admin'>Administrador</option>
                    </Form.Control>}
                </div>}
            </div>
          </div>

          <div className='flex-fill d-flex flex-column mx-3'>
            <h4>Avaliações</h4>
            <Reviews user={user} />
          </div>
          <Report
            showModal={showReportModal} setShowModal={setShowReportModal}
            type='users' idName='reportedId' idValue={user.id}
          />
        </div>}
    </>
  )
}
