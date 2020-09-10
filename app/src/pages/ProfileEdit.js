/* global localStorage */

import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { editUser, uploadUserImage } from '../services/api'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

export default (props) => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [image, setImage] = useState({})
  const [imageLabel, setImageLabel] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!props.isLogged() && !props.user) {
      history.push('/')
    }
  }, [history, props])

  useEffect(() => {
    setName(props.user.name)
    setEmail(props.user.email)
  }, [props.user])

  async function submit () {
    if (newPassword || email !== props.user.email) {
      setShowModal(true)
    } else {
      setIsLoading(true)
      if (image && image.size > 0) {
        await uploadUserImage(await image.arrayBuffer())
      }
      await editUser(password, name, email, newPassword)
      window.location.href = '/profile'
    }
  }

  async function submitWithPassword () {
    setIsLoading(true)
    if (image && image.size > 0) {
      await uploadUserImage(await image.arrayBuffer())
    }
    const token = await editUser(password, name, email, newPassword)
    if (token) {
      localStorage.token = token
    }
    window.location.href = '/profile'
  }

  return (
    <>
      <h1>Edite seu perfil</h1>

      <Row md={2} xs={1}>
        <Col className='d-flex flex-column justify-content-between'>
          <img
            width={128}
            className='mx-auto'
            src={`/api/users/${props.user.id}/image`}
            alt='imagem de usuário'
          />
          <Form.Group>
            <Form.Label>Escolha a imagem</Form.Label>
            <Form.File
              custom
              label={imageLabel}
              data-browse='Selecionar'
              onChange={e => {
                if (e.target.files[0]) {
                  setImageLabel(e.target.files[0].name)
                } else {
                  setImageLabel('')
                }
                setImage(e.target.files[0])
              }}
            />
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
