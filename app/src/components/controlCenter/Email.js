import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { sendEmail } from '../../services/api'

export default (props) => {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')

  async function send (e) {
    e.preventDefault()
    if (window.confirm('Tem certeza que quer fazer isso?')) {
      await sendEmail(email, subject, html)
      setEmail('')
      setSubject('')
      setHtml('')
    }
  }

  return (
    <Form onSubmit={send}>
      <h4 className='mb-4'>Envie email usando o email oficial do ConsumerHub</h4>

      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          placeholder='Deixar vazio para enviar para todos os usuários'
          type='text' value={email} onChange={e => setEmail(e.target.value)}
        >
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Assunto</Form.Label>
        <Form.Control
          required placeholder='Título do email'
          type='text' value={subject} onChange={e => setSubject(e.target.value)}
        >
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Mensagem</Form.Label>
        <Form.Control
          required placeholder='<p>html</p>' as='textarea'
          rows='3' minLength='3' maxLength='255'
          value={html} onChange={e => setHtml(e.target.value)}
        >
        </Form.Control>
      </Form.Group>
      <div className='text-right'>
        <Button type='submit'>Enviar</Button>
      </div>
    </Form>
  )
}
