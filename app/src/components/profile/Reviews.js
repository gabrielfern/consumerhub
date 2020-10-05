import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getUserReviews } from '../../services/api'
import NothingHere from './NothingHere'
import Stars from '../Stars'

export default (props) => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    if (props.user) {
      getUserReviews(props.user.id).then(reviews => {
        setReviews(reviews)
      })
    }
  }, [props.user])

  return (
    (reviews.length &&
      <Row xs={1} md={1} lg={2} xl={3} noGutters>
        {reviews.map((review, i) =>
          <Col key={i} className='p-1 d-flex flex-column space-break'>
            <div className='flex-fill d-flex flex-column border rounded p-3'>
              <Link to={`/product/${review.productId}`}>{review.Product.name}</Link>
              {(review.text && review.text.trim().slice(0, 200) &&
                <p className='flex-fill space-break'>
                  {review.text.trim().slice(0, 200)}
                  {review.text.trim().length > 200 &&
                    <span>...</span>}
                </p>) || <p className='text-muted'>Sem comentário</p>}
              <Stars value={Number(review.rating)} />
            </div>
          </Col>
        )}
      </Row>) || <NothingHere />
  )
}
