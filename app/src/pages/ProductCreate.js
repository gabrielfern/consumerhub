import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FileChooser from '../components/FileChooser'
import { createProduct, uploadProductImage, editProduct } from '../services/api'
import { ReactComponent as Plus } from '../assets/plus.svg'
import { ReactComponent as Minus } from '../assets/minus.svg'

export default (props) => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([{}])
  const [links, setLinks] = useState([''])
  const [isLoading, setIsLoading] = useState(false)

  async function submit () {
    setIsLoading(true)
    const resp = await createProduct()
    if (resp) {
      const product = { id: resp.id, name, description }
      links.forEach((link, i) => {
        if (link) {
          product[`link${i + 1}`] = link
        }
      })
      await editProduct(product)
      await Promise.all(images.map(async (image, i) => {
        if (image && image.size > 0) {
          return uploadProductImage(resp.id, i + 1, await image.arrayBuffer())
        }
      }))
      history.push('/product/' + resp.id)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <>
      <h1>Crie um novo produto</h1>

      <Form>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type='text' value={name} onChange={e => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as='textarea' rows='3' value={description} onChange={e => setDescription(e.target.value)}
          />
        </Form.Group>

        <hr />
        <h4>Imagens do produto</h4>
        <span className='text-muted d-none'>
          Página do produto no site do fabricante<br />
          Link para o produto a venda em e-commerce
        </span>
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
              <Minus className='wh-1-em' />
            </Button>}
          {images.length < 5 &&
            <Button
              variant='outline-primary' className='ml-2'
              onClick={() => setImages(images => [...images, ''])}
            >
              <Plus className='wh-1-em' />
            </Button>}
        </div>

        <hr />
        <h4>Links</h4>
        <span className='text-muted d-none'>
          Página do produto no site do fabricante<br />
          Link para o produto a venda em e-commerce
        </span>
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
              <Minus className='wh-1-em' />
            </Button>}
          {links.length < 3 &&
            <Button
              variant='outline-primary' className='ml-2'
              onClick={() => setLinks(links => [...links, ''])}
            >
              <Plus className='wh-1-em' />
            </Button>}
        </div>
      </Form>

      <div className='d-flex justify-content-end'>
        <Button disabled={isLoading} className='my-3' onClick={submit}>
          {isLoading ? <>Enviando...</> : <>Confirmar</>}
        </Button>
      </div>
    </>
  )
}
