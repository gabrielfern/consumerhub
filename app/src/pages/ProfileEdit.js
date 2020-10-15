import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { editUser, uploadUserImage, deleteUser } from '../services/api'
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
  const [deleteMode, setDeleteMode] = useState(false)
  const [imageURL, setImageURL] = useState('')
  const [secPassword, setSecPassword] = useState('')
  const secPasswordRef = useRef()

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

  useEffect(() => {
    if (props.user) {
      if (newPassword !== secPassword) {
        secPasswordRef.current.setCustomValidity('Senhas precisam ser iguais')
      } else {
        secPasswordRef.current.setCustomValidity('')
      }
    }
  }, [newPassword, secPassword, props.user])

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
    }
    const status = await editUser(password, name, email, newPassword)
    if (status === 200) {
      await props.loadUser()
      history.push('/profile')
    } else {
      window.alert(status === 401 ? 'Senha errada' : 'Ocorreu um erro')
      setIsLoading(false)
    }
  }

  async function deleteAccount (e) {
    if (password && !props.user.isGoogleUser) {
      e.preventDefault()
      setIsLoading(true)
      const status = await deleteUser(null, password)
      if (status === 200) {
        props.logout()
      } else {
        window.alert(status === 401 ? 'Senha errada' : 'Ocorreu um erro')
        setIsLoading(false)
      }
    } else if (props.user.isGoogleUser) {
      if (window.confirm('Realmente excluir conta?')) {
        setIsLoading(true)
        setDeleteMode(true)
        const status = await deleteUser(null, password)
        if (status === 200) {
          props.logout()
        } else {
          window.alert('Ocorreu um erro')
          setIsLoading(false)
          setDeleteMode(false)
        }
      }
    } else {
      setShowModal(true)
      setDeleteMode(true)
    }
  }

  function hideModal () {
    setShowModal(false)
    setDeleteMode(false)
    setPassword('')
  }

  return (
    <>
      <h1>Edite seu perfil</h1>

      {(props.user &&
        <Form onSubmit={submitWithoutPassword}>
          <Form.Row>
            <Col lg={6} className='d-flex flex-column justify-content-between'>
              <Image
                width='250px'
                src={imageURL || `/api/images/${props.user.image}`}
              />
              <Form.Group className='mt-3'>
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
                          Usuários Google não podem editar este campo
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
                          Usuários Google não podem editar este campo
                        </Tooltip>
                      }
                    >
                      <span>&nbsp;<InfoSVG className='wh-1-em' /></span>
                    </OverlayTrigger>}
                </Form.Label>
                <Form.Control
                  required={secPassword} disabled={props.user.isGoogleUser}
                  type='password' minLength='3' maxLength='30'
                  value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  autoComplete='new-password'
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirme a Nova Senha</Form.Label>
                <Form.Control
                  disabled={props.user.isGoogleUser}
                  type='password' minLength='3' maxLength='30'
                  value={secPassword} onChange={e => setSecPassword(e.target.value)}
                  ref={secPasswordRef} autoComplete='new-password'
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <div className='py-3 d-flex'>
            <Button
              variant='outline-danger' disabled={!showModal && isLoading}
              onClick={deleteAccount}
            >
              Excluir Conta
            </Button>
            <div className='text-right flex-fill'>
              <Button type='submit' disabled={!showModal && isLoading}>
                {!showModal && !deleteMode && isLoading ? 'Enviando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </Form>) || <p>Carregando...</p>}

      <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirme sua senha</Modal.Title>
        </Modal.Header>
        <Form onSubmit={deleteMode ? deleteAccount : submit}>
          <Modal.Body>
            <Alert variant={deleteMode ? 'danger' : 'warning'}>
              {!deleteMode && 'Senha atual necessaria para se alterar email ou senha'}
              {deleteMode && 'Senha necessaria para excluir a conta'}
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
            <Button variant='secondary' onClick={hideModal}>
              Cancelar
            </Button>
            <Button
              type='submit' disabled={isLoading}
              variant={deleteMode ? 'danger' : 'primary'}
            >
              {isLoading && !deleteMode ? 'Enviando...' : 'Confirmar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
