import React, { useState, useEffect } from 'react'
import {
  getReports, createReport as createReportAPI,
  deleteReport as deleteReportAPI
} from '../services/api'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

export default (props) => {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (props.showModal) {
      getReports(props.type, props.idName, props.idValue).then(reports => {
        if (reports[0]) {
          setShowDelete(true)
          setText(reports[0].text)
        }
      })
    }
  }, [props.showModal, props.type, props.idName, props.idValue])

  async function createReport (e) {
    e.preventDefault()
    setIsLoading(true)
    await createReportAPI(props.type, props.idName, props.idValue, text)
    hide()
  }

  async function deleteReport () {
    setIsLoading(true)
    await deleteReportAPI(props.type, props.idName, props.idValue)
    hide()
  }

  function hide () {
    props.setShowModal(false)
    setShowDelete(false)
    setIsLoading(false)
    setText('')
  }

  return (
    <Modal show={props.showModal} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>Crie um report</Modal.Title>
      </Modal.Header>
      <Form onSubmit={createReport}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Motivo</Form.Label>
            <Form.Control
              required as='textarea' rows='3' minLength='3' maxLength='255'
              value={text} onChange={e => setText(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {showDelete &&
            <div className='flex-fill'>
              <Button
                variant='outline-danger' disabled={isLoading} onClick={deleteReport}
              >
                Excluir
              </Button>
            </div>}
          <Button variant='secondary' disabled={isLoading} onClick={hide}>
            Cancelar
          </Button>
          <Button type='submit' variant='primary' disabled={isLoading}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
