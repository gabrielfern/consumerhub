import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FileChooser from '../components/FileChooser'
import {
  createStagingProduct, uploadStagingProductImage, editStagingProduct
} from '../services/api'
import { ReactComponent as PlusSVG } from '../assets/plus.svg'
import { ReactComponent as MinusSVG } from '../assets/minus.svg'

export default (props) => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([{}])
  const [links, setLinks] = useState([''])
  const [isLoading, setIsLoading] = useState(false)

  async function submit (e) {
    e.preventDefault()
    setIsLoading(true)
    const resp = await createStagingProduct()
    if (resp) {
      const product = { id: resp.id, name, description }
      links.forEach((link, i) => {
        if (link) {
          product[`link${i + 1}`] = link
        }
      })
      await editStagingProduct(product)
      await Promise.all(images.map(async (image, i) => {
        if (image && image.size > 0) {
          return uploadStagingProductImage(resp.id, i + 1, await image.arrayBuffer())
        }
      }))
      history.push(`/staging?id=${resp.id}&userId=${props.user.id}`)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <>
      <h1>Crie um novo produto</h1>

      <Form onSubmit={submit}>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            required type='text' minLength='3' maxLength='100'
            value={name} onChange={e => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as='textarea' rows='3' maxLength='1000'
            value={description} onChange={e => setDescription(e.target.value)}
          />
        </Form.Group>

        <hr />
        <h4>Imagens do produto</h4>
        {images.map((_, i) => {
          return (
            <Form.Group key={i}>
              <FileChooser setFile={file => {
                setImages(images => {
                  const newImages = images.slice()
                  newImages[i] = file
                  return newImages
                })
              }}
              />
            </Form.Group>
          )
        })}
        <div className='d-flex justify-content-end'>
          {images.length > 1 &&
            <Button
              variant='outline-danger' onClick={() => setImages(images => images.slice(0, -1))}
            >
              <MinusSVG className='wh-1-em' />
            </Button>}
          {images.length < 5 &&
            <Button
              variant='outline-primary' className='ml-2'
              onClick={() => setImages(images => [...images, ''])}
            >
              <PlusSVG className='wh-1-em' />
            </Button>}
        </div>

        <hr />
        <h4>Links</h4>
        {links.map((link, i) => {
          return (
            <Form.Group key={i}>
              <Form.Control
                type='url' value={link} onChange={e => {
                  e.persist()
                  setLinks(links => {
                    const newLinks = links.slice()
                    newLinks[i] = e.target.value
                    return newLinks
                  })
                }}
                placeholder='https://consumerhub.herokuapp.com/'
              />
            </Form.Group>
          )
        })}
        <div className='d-flex justify-content-end'>
          {links.length > 1 &&
            <Button
              variant='outline-danger' onClick={() => setLinks(links => links.slice(0, -1))}
            >
              <MinusSVG className='wh-1-em' />
            </Button>}
          {links.length < 3 &&
            <Button
              variant='outline-primary' className='ml-2'
              onClick={() => setLinks(links => [...links, ''])}
            >
              <PlusSVG className='wh-1-em' />
            </Button>}
        </div>
        <div className='d-flex justify-content-end'>
          <Button type='submit' disabled={isLoading} className='my-3'>
            {isLoading ? <>Enviando...</> : <>Confirmar</>}
          </Button>
        </div>
      </Form>
    </>
  )
}
