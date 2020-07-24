import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getProduct, getProductReviews } from '../services/api'

export default () => {
  const history = useHistory()
  const { productId } = useParams()
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const product = await getProduct(productId)
        setId(product.id)
        setName(product.name)
        setDescription(product.description)
        setReviews(await getProductReviews(productId))
      } catch {}
    })()
  }, [productId])

  return (
    <div className='container my-3'>
      <div>
        <h1>Produto</h1>
        <p>
          <button className='btn btn-secondary m-2' onClick={() => history.push('/products')}>Produtos</button>
          <button className='btn btn-secondary m-2' onClick={() => history.push(`/product/${id}/newReview`)}>Avaliar</button>
        </p>
        <p><b>ID:</b> {id}</p>
        <p><b>Nome:</b> {name}</p>
        <p><b>Descrição:</b> {description}</p>
      </div>
      <div className='my-3'>
        {id &&
          <img
            src={`/api/products/${id}/image/1`} alt='imagem de produto 1'
            style={{ display: 'block', maxWidth: '100%' }}
          />}
        <br />
        {id &&
          <img
            src={`/api/products/${id}/image/2`} alt='imagem de produto 2'
            style={{ display: 'block', maxWidth: '100%' }}
          />}
        <br />
        {id &&
          <img
            src={`/api/products/${id}/image/3`} alt='imagem de produto 3'
            style={{ display: 'block', maxWidth: '100%' }}
          />}
        <br />
        {id &&
          <img
            src={`/api/products/${id}/image/4`} alt='imagem de produto 4'
            style={{ display: 'block', maxWidth: '100%' }}
          />}
        <br />
        {id &&
          <img
            src={`/api/products/${id}/image/5`} alt='imagem de produto 5'
            style={{ display: 'block', maxWidth: '100%' }}
          />}
      </div>
      <div>
        <h2>Avaliações</h2>
        {
          reviews.map(review =>
            <div key={review.id}>
              <hr />
              <p><Link to={`/review/${review.id}`}>{review.id}</Link></p>
              <p><b>Texto:</b> {review.text}</p>
              <p><b>Nota:</b> {review.rating}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}
