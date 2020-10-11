import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getUserReviews } from '../../services/api'
import NothingHere from '../NothingHere'
import Stars from '../Stars'
import ShowMore from '../ShowMore'

export default (props) => {
  const defaultSlice = 12
  const [reviews, setReviews] = useState([])
  const [slice, setSlice] = useState(defaultSlice)

  useEffect(() => {
    if (props.user) {
      getUserReviews(props.user.id).then(reviews => {
        setReviews(reviews)
      })
    }
  }, [props.user])

  return (
    (reviews.length &&
      <>
        <Row xs={1} md={1} lg={2} xl={3} noGutters>
          {reviews.slice(0, slice).map((review, i) =>
            <Col key={i} className='p-1 d-flex flex-column word-break'>
              <div className='flex-fill d-flex flex-column border rounded p-3'>
                <Link to={`/product/${review.productId}#${review.id}`}>
                  {review.Product.name}
                </Link>
                {(review.text && review.text.trim() &&
                  <p className='flex-fill'>
                    {review.text.trim().slice(0, 200)}
                    {review.text.trim().length > 200 &&
                      <span>...</span>}
                  </p>) || <p className='text-muted'>Sem comentário</p>}
                <Stars value={Number(review.rating)} />
              </div>
            </Col>
          )}
        </Row>
        <ShowMore
          slice={slice} defaultSlice={defaultSlice}
          setSlice={setSlice} length={reviews.length}
        />
      </>) || <NothingHere />
  )
}
