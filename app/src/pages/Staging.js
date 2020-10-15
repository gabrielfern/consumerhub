import React, { useState, useEffect, useCallback } from 'react'
import { useHistory, useLocation, Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import {
  getStagingProduct, deleteStagingProduct, createProduct,
  uploadStagingProductImage, editStagingProduct, editProduct
} from '../services/api'
import Image from '../components/Image'
import FileChooser from '../components/FileChooser'
import { ReactComponent as EditSVG } from '../assets/edit.svg'
import { ReactComponent as CheckSVG } from '../assets/check.svg'
import { ReactComponent as CloseSVG } from '../assets/close.svg'
import { ReactComponent as DeleteSVG } from '../assets/delete.svg'

export default (props) => {
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search)
  const productId = query.get('id')
  const userId = query.get('userId')
  const [product, setProduct] = useState()
  const [headerEditMode, setHeaderEditMode] = useState(false)
  const [imagesEditMode, setImagesEditMode] = useState(false)
  const [linksEditMode, setLinksEditMode] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState(Array(5).fill({}))
  const [links, setLinks] = useState(Array(3).fill(''))

  let hasNoLinks = true

  const fillHeader = useCallback((product) => {
    if (!headerEditMode) {
      setName(product.name)
      setDescription(product.description)
    }
  }, [headerEditMode])

  const fillImages = useCallback(() => {
    if (!imagesEditMode) {
      setImages(images => images.map(() => {
        return {}
      }))
    }
  }, [imagesEditMode])

  const fillLinks = useCallback((product) => {
    if (!linksEditMode) {
      setLinks(links => links.map((_, i) => {
        if (product[`link${i + 1}`]) {
          return product[`link${i + 1}`]
        }
        return ''
      }))
    }
  }, [linksEditMode])

  const loadStagingProduct = useCallback(() => {
    if (props.user && productId && userId) {
      getStagingProduct(productId, userId).then(product => {
        if (product[0]) {
          setProduct(product[0])
        }
      })
    }
  }, [props.user, productId, userId])

  useEffect(() => {
    loadStagingProduct()
  }, [loadStagingProduct])

  useEffect(() => {
    if (product) {
      fillHeader(product)
      fillImages()
      fillLinks(product)
    }
  }, [product, fillHeader, fillImages, fillLinks])

  async function accept () {
    if (product.isNewProduct) {
      await createProduct(product.id, product.userId)
    } else {
      await editProduct(product.id, product.userId)
    }
    history.push(`/product/${product.id}`)
  }

  async function remove (redirectToProfile) {
    if (window.confirm('Realmente excluir este produto em análise?')) {
      await deleteStagingProduct(product.id, product.userId)
      if (redirectToProfile === true) {
        history.push('/profile')
      } else {
        history.push('/control-center')
      }
    }
  }

  function cancelHeaderEditing () {
    setHeaderEditMode(false)
    fillHeader(product)
  }

  async function confirmHeaderEditing () {
    setHeaderEditMode(false)
    if (product.name !== name || product.description !== description) {
      await editStagingProduct({
        id: product.id, name, description
      })
    }
    loadStagingProduct()
  }

  function cancelImagesEditing () {
    setImagesEditMode(false)
    fillImages()
  }

  async function confirmImagesEditing () {
    setImagesEditMode(false)
    await Promise.all(images.map(async (image, i) => {
      if (image && image.size > 0) {
        return uploadStagingProductImage(product.id, i + 1, await image.arrayBuffer())
      } else if (image === null) {
        return uploadStagingProductImage(product.id, i + 1, null)
      }
    }))
    loadStagingProduct()
  }

  function cancelLinksEditing () {
    setLinksEditMode(false)
    fillLinks(product)
  }

  async function confirmLinksEditing () {
    setLinksEditMode(false)
    await Promise.all(links.map(async (link, i) => {
      if (!link) {
        link = null
      }
      if (link !== product[`link${i + 1}`]) {
        return editStagingProduct({
          id: product.id, [`link${i + 1}`]: link
        })
      }
    }))
    loadStagingProduct()
  }

  return (
    <>
      <h1>Produto em análise</h1>

      {product &&
        <>
          {props.user && props.user.type !== 'user' &&
            <Alert variant='warning'>
              <h4>Zona de moderadores</h4>
              {product.isNewProduct && <h6>Este é um produto novo</h6>}
              {!product.isNewProduct &&
                <h6>
                  Esta é uma edição a um produto existente, aceitá-lo <b>substituirá</b> o&nbsp;
                  <Link to={`/product/${product.id}`}>Produto Atual</Link>
                  <ul className='mb-0'>
                    <li>Categorias</li>
                    <li>Avaliações</li>
                  </ul>
                  Serão mantidas
                </h6>}
              <div className='d-flex justify-content-end'>
                <Button className='mr-1' variant='outline-danger' onClick={remove}>
                    Recusar
                </Button>
                <Button variant='outline-primary' onClick={accept}>
                    Aceitar
                </Button>
              </div>
            </Alert>}

          {props.user && props.user.type === 'user' &&
            props.user.id === product.userId &&
              <Alert variant='primary'>
                <h4>Produto aguardando algum moderador aceitá-lo</h4>
                <h6>Caso desista da sua submissão, clique em cancelar</h6>
                {!product.isNewProduct &&
                  <h6>
                  Esta é uma edição do&nbsp;
                    <Link to={`/product/${product.id}`}>Produto</Link>
                  </h6>}
                <div className='d-flex justify-content-end'>
                  <Button className='mr-1' variant='danger' onClick={() => remove(true)}>
                    Cancelar
                  </Button>
                </div>
              </Alert>}

          <div className='mb-4 d-flex align-items-center'>
            {(!headerEditMode &&
              <h3 className='m-0'>{product.name}</h3>) ||
                <Form.Control
                  required type='text' minLength='3' maxLength='100'
                  placeholder='Nome do produto'
                  value={name} onChange={e => setName(e.target.value)}
                />}
            <div className='flex-fill text-right'>
              {props.user.id === product.userId &&
                <div>
                  {!headerEditMode &&
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-dark'
                      onClick={() => setHeaderEditMode(true)}
                    >
                      <EditSVG />
                    </Button>}
                  {headerEditMode &&
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-dark'
                      onClick={cancelHeaderEditing}
                    >
                      <CloseSVG />
                    </Button>}
                  {headerEditMode &&
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-dark'
                      onClick={confirmHeaderEditing}
                    >
                      <CheckSVG />
                    </Button>}
                </div>}
            </div>
          </div>

          {(!headerEditMode &&
            (product.description && product.description.trim()
              ? <div className='space-break'>{product.description.trim()}</div>
              : <p className='text-muted'>Sem descrição</p>)) ||
                <Form.Control
                  as='textarea' rows='3' maxLength='1000'
                  placeholder='Descreva o produto em até 1000 caracteres'
                  value={description} onChange={e => setDescription(e.target.value)}
                />}

          <hr />
          <div className='mb-1 d-flex align-items-center'>
            <h4 className='m-0'>Imagens do produto</h4>
            <div className='flex-fill text-right'>
              {props.user.id === product.userId &&
                <div>
                  {!imagesEditMode &&
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-dark'
                      onClick={() => setImagesEditMode(true)}
                    >
                      <EditSVG />
                    </Button>}
                  {imagesEditMode &&
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-dark'
                      onClick={cancelImagesEditing}
                    >
                      <CloseSVG />
                    </Button>}
                  {imagesEditMode &&
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-dark'
                      onClick={confirmImagesEditing}
                    >
                      <CheckSVG />
                    </Button>}
                </div>}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div
              className='d-flex justify-content-between align-items-center'
              style={{ width: 2550, minHeight: 550 }}
            >
              {images.map((image, i) =>
                <div key={i} className='d-flex flex-column'>
                  <Image
                    key={i}
                    width='500px'
                    src={`/api/images/${product['image' + (i + 1)]}`}
                  />
                  {imagesEditMode &&
                    <div className='m-3 d-flex align-items-center'>
                      <FileChooser
                        imageOnly maxSize={5e6}
                        setFile={file => {
                          setImages(images.map((image, j) => {
                            if (i === j) {
                              return file
                            }
                            return image
                          }))
                        }}
                      />
                      <Button
                        className='border-0 p-2 m-1'
                        variant={image === null ? 'dark' : 'outline-dark'}
                        onClick={() => {
                          setImages(images.map((image, j) => {
                            if (i === j && image) {
                              return null
                            } else if (i === j && image === null) {
                              return {}
                            }
                            return image
                          }))
                        }}
                      >
                        <DeleteSVG />
                      </Button>
                    </div>}
                </div>
              )}
            </div>
          </div>

          <hr />
          <div className='mb-2 d-flex align-items-center'>
            <h4 className='m-0'>Links</h4>
            <div className='flex-fill text-right'>
              {props.user.id === product.userId &&
                <div>
                  {!linksEditMode &&
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-dark'
                      onClick={() => setLinksEditMode(true)}
                    >
                      <EditSVG />
                    </Button>}
                  {linksEditMode &&
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-dark'
                      onClick={cancelLinksEditing}
                    >
                      <CloseSVG />
                    </Button>}
                  {linksEditMode &&
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-dark'
                      onClick={confirmLinksEditing}
                    >
                      <CheckSVG />
                    </Button>}
                </div>}
            </div>
          </div>
          {links.map((link, i) => {
            if (product[`link${i}`]) hasNoLinks = false
            return (
              (!linksEditMode &&
                <p key={i}>
                  <a href={product[`link${i + 1}`]} target='_blank' rel='noopener noreferrer'>
                    {product[`link${i + 1}`]}
                  </a>
                </p>) ||
                  <Form.Group key={i}>
                    <Form.Control
                      type='url' value={link} onChange={e => {
                        setLinks(links.map((link, j) => {
                          if (i === j) {
                            return e.target.value
                          }
                          return link
                        }))
                      }}
                      placeholder='https://consumerhub.herokuapp.com/'
                    />
                  </Form.Group>
            )
          })}
          {hasNoLinks && !linksEditMode && <p className='text-muted'>Produto sem links</p>}
        </>}
    </>
  )
}
