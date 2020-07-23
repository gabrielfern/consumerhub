import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { getUser, createReview } from '../services/api'

export default () => {
  const history = useHistory()
  const { productId } = useParams()
  const [text, setText] = useState('')
  const [rating, setRating] = useState('5')

  async function submit () {
    const user = await getUser()
    const review = await createReview({
      text,
      rating,
      userId: user.id,
      productId: productId
    })
    if (review) {
      history.push(`/review/${review.id}`)
    }
  }

  return (
    <>
      <div>
        <h1>Nova avaliação</h1>
        <p>
          <button onClick={() => history.push('/products')}>Produtos</button>
        </p>
        <p>
          <span><b>Texto </b></span>
          <input type='text' value={text} onChange={e => setText(e.target.value)} />
        </p>
        <p>
          <span><b>Nota </b></span>
          <select value={rating} onChange={e => setRating(e.target.value)}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
          </select>
        </p>
        <p>
          <button onClick={submit}>Confirmar</button>
        </p>
      </div>
    </>
  )
}
