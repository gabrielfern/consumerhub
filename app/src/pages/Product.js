import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import { getProduct, deleteProduct, getProductReviews, createReview } from '../services/api'
import Image from '../components/Image'
import Stars from '../components/Stars'
import { ReactComponent as ReviewSVG } from '../assets/review.svg'

export default (props) => {
  const { productId } = useParams()
  const history = useHistory()
  const [product, setProduct] = useState()
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState('5')
  const [reviews, setReviews] = useState([])

  let hasNoLinks = true

  const loadReviews = useCallback(() => {
    getProductReviews(productId).then(reviews => {
      setReviews(reviews)
    })
  }, [productId])

  useEffect(() => {
    getProduct(productId).then(product => {
      setProduct(product)
    })
    loadReviews()
  }, [props.user, productId, loadReviews])

  async function remove () {
    await deleteProduct(product.id)
    history.push('/products')
  }

  async function submitReview (e) {
    e.preventDefault()
    const review = {
      text: reviewText,
      rating: reviewRating,
      productId: product.id
    }
    await createReview(review)
    loadReviews()
  }

  return (
    <>
      <h1>Produto</h1>

      {product &&
        <>
          {props.user && props.user.type !== 'user' &&
            <div className='d-flex justify-content-end my-2'>
              <Button variant='outline-danger' onClick={remove}>
                  Deletar
              </Button>
            </div>}

          <h3>{product.name}</h3>
          {product.description.trim()
            ? <div className='space-break'>{product.description}</div>
            : <p className='text-muted'>Sem descrição</p>}

          <hr />
          <h4>Imagens do produto</h4>
          <div style={{ overflowX: 'auto' }}>
            <div
              className='d-flex justify-content-between align-items-center'
              style={{ width: 2550, height: 550 }}
            >
              {[1, 2, 3, 4, 5].map((i) =>
                <Image
                  key={i}
                  width='500px'
                  src={`/api/images/${product['image' + i]}`}
                />
              )}
            </div>
          </div>

          <hr />
          <h4>Links</h4>
          {[1, 2, 3].map(i => {
            if (product[`link${i}`]) hasNoLinks = false
            return (
              <p key={i}>
                <a href={product[`link${i}`]} target='_blank' rel='noopener noreferrer'>
                  {product[`link${i}`]}
                </a>
              </p>
            )
          })}
          {hasNoLinks && <p className='text-muted'>Produto sem links</p>}

          <hr />
          <h4>Avaliações</h4>

          <Form onSubmit={submitReview}>
            <Form.Row>
              <Col xs={12} md={10} lg={11}>
                <Form.Group>
                  <Form.Control
                    placeholder='Deixe seu comentário aqui'
                    as='textarea' rows='3' value={reviewText} onChange={e => setReviewText(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={3} md={2} lg={1}>
                <Form.Group>
                  <Form.Control
                    placeholder='Deixe seu comentário aqui' maxLength='500'
                    as='select' rows='3' value={reviewRating} onChange={e => setReviewRating(e.target.value)}
                  >
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                  </Form.Control>
                </Form.Group>
                <Button type='submit'><ReviewSVG className='wh-1-em' /></Button>
              </Col>
            </Form.Row>
          </Form>

          {reviews.map((review, i) =>
            <div key={i} className='py-3 d-flex'>
              <div>
                <Image
                  width='128px'
                  src={`/api/images/${review.User.image}`}
                />
              </div>
              <div className='ml-3'>
                <p><b>{review.User.name}</b></p>
                {review.text.trim()
                  ? <p className='space-break'>{review.text.trim()}</p>
                  : <p className='text-muted'>Sem comentário</p>}
                <Stars value={Number(review.rating)} />
              </div>
            </div>
          )}
        </>}
    </>
  )
}
