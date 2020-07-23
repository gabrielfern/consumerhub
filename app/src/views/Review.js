import React, { useState, useEffect } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { getReview } from '../services/api'

export default () => {
  const history = useHistory()
  const { reviewId } = useParams()
  const [id, setId] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState('')
  const [userId, setUserId] = useState('')
  const [productId, setProductId] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const review = await getReview(reviewId)
        setId(review.id)
        setText(review.text)
        setRating(review.rating)
        setUserId(review.userId)
        setProductId(review.productId)
      } catch {}
    })()
  }, [reviewId])

  return (
    <>
      <div>
        <h1>Avaliação</h1>
        <p>
          <button onClick={() => history.push('/products')}>Produtos</button>
        </p>
        <p><b>ID:</b> {id}</p>
        <p><b>Texto:</b> {text}</p>
        <p><b>Nota:</b> {rating}</p>
        <p><b>ID do usuário:</b> {userId}</p>
        <p><b>ID do produto:</b> <Link to={`/product/${productId}`}>{productId}</Link></p>
      </div>
    </>
  )
}
