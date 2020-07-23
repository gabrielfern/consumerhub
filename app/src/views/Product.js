import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { getProduct } from '../services/api'

export default () => {
  const history = useHistory()
  const { productId } = useParams()
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const product = await getProduct(productId)
        setId(product.id)
        setName(product.name)
        setDescription(product.description)
      } catch {}
    })()
  }, [productId])

  return (
    <>
      <div>
        <h1>Produto</h1>
        <p>
          <button onClick={() => history.push('/products')}>Produtos</button>
        </p>
        <p><b>ID:</b> {id}</p>
        <p><b>Nome:</b> {name}</p>
        <p><b>Descrição:</b> {description}</p>
      </div>
      <div>
        <br />
        <img
          src={`/api/products/${id}/image/1`} alt='imagem de produto 1'
          style={{ display: 'block', maxWidth: '100%' }}
        />
        <br />
        <img
          src={`/api/products/${id}/image/2`} alt='imagem de produto 2'
          style={{ display: 'block', maxWidth: '100%' }}
        />
        <br />
        <img
          src={`/api/products/${id}/image/3`} alt='imagem de produto 3'
          style={{ display: 'block', maxWidth: '100%' }}
        />
        <br />
        <img
          src={`/api/products/${id}/image/4`} alt='imagem de produto 4'
          style={{ display: 'block', maxWidth: '100%' }}
        />
        <br />
        <img
          src={`/api/products/${id}/image/5`} alt='imagem de produto 5'
          style={{ display: 'block', maxWidth: '100%' }}
        />
      </div>
    </>
  )
}
