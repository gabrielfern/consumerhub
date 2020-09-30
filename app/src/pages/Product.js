import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Media from 'react-bootstrap/Media'
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

          <p><b>ID:</b> {product.id}</p>
          <p><b>Nome:</b> {product.name}</p>
          <p><b>Descrição:</b> {product.description}</p>

          <hr />
          <h4>Imagens do produto</h4>
          <div style={{ overflowX: 'auto' }}>
            <div
              className='d-flex justify-content-between align-items-center'
              style={{ width: 2550, height: 550 }}
            >
              {[...Array(5).keys()].map((i) =>
                <Image
                  key={i}
                  width='500px'
                  src={`/api/products/${product.id}/image/${i + 1}`}
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

          <hr />
          <h4>Avaliações</h4>

          <Form onSubmit={submitReview}>
            <Form.Row>
              <Col>
                <Form.Group>
                  <Form.Control
                    placeholder='Deixe seu comentário aqui'
                    as='textarea' rows='3' value={reviewText} onChange={e => setReviewText(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={1}>
                <Form.Group>
                  <Form.Control
                    placeholder='Deixe seu comentário aqui'
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
            <Media key={i}>
              <Image
                width='128px'
                src={`/api/users/${review.userId}/image`}
              />
              <Media.Body className='m-2'>
                <p><b>ID: </b>{review.id}</p>
                <p><b>ID de Usuário: </b>{review.userId}</p>
                <p><b>Comentário: </b>{review.text}</p>
                <b>Nota:</b><Stars value={Number(review.rating)} />
              </Media.Body>
            </Media>
          )}
        </>}
    </>
  )
}
