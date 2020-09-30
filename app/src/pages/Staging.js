import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import {
  getStagingProduct, getStagingProductImage, deleteStagingProduct, createProduct
} from '../services/api'
import Image from '../components/Image'

export default (props) => {
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search)
  const productId = query.get('id')
  const userId = query.get('userId')
  const [product, setProduct] = useState()
  const [imageURLs, setImageURLs] = useState(Array(5).fill(''))

  useEffect(() => {
    if (props.user && productId && userId) {
      getStagingProduct(productId, userId).then(product => {
        if (product[0]) {
          setProduct(product[0])
          Array(5).fill().forEach((_, i) => {
            getStagingProductImage(product[0].id, userId, i + 1).then(image => {
              if (image.size > 0) {
                setImageURLs(imageURLs => {
                  const newImageURLs = imageURLs.slice()
                  newImageURLs[i] = URL.createObjectURL(image)
                  return newImageURLs
                })
              }
            })
          })
        }
      })
    }
  }, [props.user, productId, userId])

  async function accept () {
    await createProduct(product.id, product.userId)
    history.push(`/product/${product.id}`)
  }

  async function remove () {
    await deleteStagingProduct(product.id, product.userId)
    history.push('/control-center')
  }

  return (
    <>
      <h1>Produto em análise</h1>

      {product &&
        <>
          {props.user && props.user.type !== 'user' &&
            <div className='d-flex justify-content-end my-2'>
              <Button className='mr-1' variant='outline-danger' onClick={remove}>
                  Deletar
              </Button>
              <Button variant='outline-primary' onClick={accept}>
                  Aceitar
              </Button>
            </div>}
          <p><b>Product ID:</b> {product.id}</p>
          <p><b>User ID:</b> {product.userId}</p>
          <p><b>Nome:</b> {product.name}</p>
          <p><b>Descrição:</b> {product.description}</p>

          <hr />
          <h4>Imagens do produto</h4>
          <div style={{ overflowX: 'auto' }}>
            <div
              className='d-flex justify-content-between align-items-center'
              style={{ width: 2550, height: 550 }}
            >
              {imageURLs.map((imageURL, i) =>
                <Image
                  key={i}
                  width='500px'
                  src={imageURL}
                />
              )}
            </div>
          </div>

          <hr />
          <h4>Links</h4>
          {[1, 2, 3].map(i =>
            <p key={i}>
              <a href={product[`link${i}`]}>{product[`link${i}`]}</a>
            </p>
          )}
        </>}
    </>
  )
}
