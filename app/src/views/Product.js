import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../services/api'

export default () => {
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
        <p><b>ID:</b> {id}</p>
        <p><b>Nome:</b> {name}</p>
        <p><b>Description:</b> {description}</p>
      </div>
      <div>
        <br />
        <img
          src={`/api/products/image/${id}/1`} alt='imagem de produto 1'
          style={{ display: 'block', maxWidth: '100%' }}
        />
        <br />
        <img
          src={`/api/products/image/${id}/2`} alt='imagem de produto 2'
          style={{ display: 'block', maxWidth: '100%' }}
        />
        <br />
        <img
          src={`/api/products/image/${id}/3`} alt='imagem de produto 3'
          style={{ display: 'block', maxWidth: '100%' }}
        />
        <br />
        <img
          src={`/api/products/image/${id}/4`} alt='imagem de produto 4'
          style={{ display: 'block', maxWidth: '100%' }}
        />
        <br />
        <img
          src={`/api/products/image/${id}/5`} alt='imagem de produto 5'
          style={{ display: 'block', maxWidth: '100%' }}
        />
      </div>
    </>
  )
}
