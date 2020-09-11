import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { editUser, uploadUserImage } from '../services/api'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import FileChooser from '../components/FileChooser'
import UserImage from '../components/UserImage'

export default (props) => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [image, setImage] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

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
  }, [props])

  async function submit () {
    if (newPassword || email !== props.user.email) {
      setShowModal(true)
    } else {
      setIsLoading(true)
      if (image && image.size > 0) {
        await uploadUserImage(await image.arrayBuffer())
      }
      await editUser(password, name, email, newPassword)
      setIsLoading(false)
      props.loadUser()
      history.push('/profile')
    }
  }

  async function submitWithPassword () {
    setIsLoading(true)
    if (image && image.size > 0) {
      await uploadUserImage(await image.arrayBuffer())
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
        <>
          <Row md={2} xs={1}>
            <Col className='d-flex flex-column justify-content-between'>
              <UserImage className='align-self-center' userId={props.user.id} />
              <Form.Group>
                <Form.Label>Escolha a imagem</Form.Label>
                <FileChooser setFile={setImage} />
              </Form.Group>
            </Col>
            <Col className='d-flex flex-column justify-content-between'>
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type='text' value={name} onChange={e => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='text' value={email} onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button disabled={isLoading} className='mb-4' onClick={submit}>
            {isLoading ? <>Enviando...</> : <>Confirmar</>}
          </Button>
        </>) || <p>Carregando...</p>}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirme sua senha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant='warning'>
            Senha atual necessaria para se alterar email ou senha
          </Alert>
          <Form.Group>
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type='password' value={password} onChange={e => setPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button disabled={isLoading} variant='primary' onClick={() => submitWithPassword()}>
            {isLoading ? <>Enviando...</> : <>Confirmar</>}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
