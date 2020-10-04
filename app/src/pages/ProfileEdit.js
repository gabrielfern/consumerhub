import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { editUser, uploadUserImage } from '../services/api'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import FileChooser from '../components/FileChooser'
import Image from '../components/Image'
import { ReactComponent as InfoSVG } from '../assets/info.svg'

export default (props) => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [image, setImage] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [imageURL, setImageURL] = useState('')

  useEffect(() => {
    if (!props.isLogged) {
      history.push('/')
    }
  }, [history, props.isLogged])

  useEffect(() => {
    if (props.user) {
      setName(props.user.name)
      setEmail(props.user.email)
    }
  }, [props.user])

  useEffect(() => {
    if (image) {
      setImageURL(URL.createObjectURL(image))
    } else {
      setImageURL('')
    }
  }, [image])

  async function submitWithoutPassword (e) {
    e.preventDefault()
    if (newPassword || email !== props.user.email) {
      setShowModal(true)
    } else {
      submit()
    }
  }

  async function submit (e) {
    e && e.preventDefault()
    setIsLoading(true)
    if (image) {
      await uploadUserImage(await image.arrayBuffer())
      props.setUserImageVersion(version => version + 1)
    }
    await editUser(password, name, email, newPassword)
    setIsLoading(false)
    props.loadUser()
    history.push('/profile')
  }

  return (
    <>
      <h1>Edite seu perfil</h1>

      {(props.user &&
        <Form onSubmit={submitWithoutPassword}>
          <Form.Row>
            <Col lg={6} className='d-flex flex-column justify-content-between'>
              <Image
                width='128px'
                src={imageURL || `/api/users/${props.user.id}/image?${props.userImageVersion}`}
              />
              <Form.Group>
                <Form.Label>Escolha a imagem</Form.Label>
                <FileChooser imageOnly setFile={setImage} maxSize={5e6} />
              </Form.Group>
            </Col>
            <Col lg={6} className='d-flex flex-column justify-content-between'>
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  required type='text' minLength='3' maxLength='50'
                  value={name} onChange={e => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Email
                  {props.user.isGoogleUser &&
                    <OverlayTrigger
                      placement='top'
                      overlay={
                        <Tooltip>
                          Usuarios google não podem editar este campo
                        </Tooltip>
                      }
                    >
                      <span>&nbsp;<InfoSVG className='wh-1-em' /></span>
                    </OverlayTrigger>}
                </Form.Label>
                <Form.Control
                  disabled={props.user.isGoogleUser}
                  required type='email' value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Nova Senha
                  {props.user.isGoogleUser &&
                    <OverlayTrigger
                      placement='top'
                      overlay={
                        <Tooltip>
                          Usuarios google não podem editar este campo
                        </Tooltip>
                      }
                    >
                      <span>&nbsp;<InfoSVG className='wh-1-em' /></span>
                    </OverlayTrigger>}
                </Form.Label>
                <Form.Control
                  disabled={props.user.isGoogleUser}
                  type='password' minLength='3' maxLength='30'
                  value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  autoComplete='new-password'
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <div className='py-3 text-center'>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? <>Enviando...</> : <>Confirmar</>}
            </Button>
          </div>
        </Form>) || <p>Carregando...</p>}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirme sua senha</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submit}>
          <Modal.Body>
            <Alert variant='warning'>
              Senha atual necessaria para se alterar email ou senha
            </Alert>
            <Form.Group>
              <Form.Label>Senha</Form.Label>
              <Form.Control
                required type='password' minLength='3' maxLength='30'
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type='submit' disabled={isLoading} variant='primary'>
              {isLoading ? <>Enviando...</> : <>Confirmar</>}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
