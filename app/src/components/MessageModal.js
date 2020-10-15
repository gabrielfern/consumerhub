import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  createProduct, editProduct, deleteStagingProduct
} from '../services/api'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

export default (props) => {
  const history = useHistory()
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function accept (e) {
    e.preventDefault()
    setIsLoading(true)
    if (props.product.isNewProduct) {
      await createProduct(props.product.id, props.product.userId, text)
    } else {
      await editProduct(props.product.id, props.product.userId, text)
    }
    history.push(`/product/${props.product.id}`)
  }

  async function remove (e) {
    e.preventDefault()
    setIsLoading(true)
    await deleteStagingProduct(props.product.id, props.product.userId, text)
    history.push('/control-center')
  }

  function hide () {
    props.setShowModal(false)
    setIsLoading(false)
    setText('')
  }

  return (
    <Modal show={props.showModal} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {props.acceptMode ? 'Aceitando Produto' : 'Recusando Produto'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={props.acceptMode ? accept : remove}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Mensagem para o Usuário que submeteu este produto</Form.Label>
            <Form.Control
              placeholder='Opcional' as='textarea'
              rows='3' minLength='3' maxLength='255'
              value={text} onChange={e => setText(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' disabled={isLoading} onClick={hide}>
            Cancelar
          </Button>
          <Button
            type='submit' variant={props.acceptMode ? 'primary' : 'danger'}
            disabled={isLoading}
          >
            {props.acceptMode ? 'Aceitar' : 'Recusar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
