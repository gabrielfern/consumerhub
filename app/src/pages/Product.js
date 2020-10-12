import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import {
  getProduct, deleteProduct, getProductReviews,
  createReview, getProductCategories, getCategories,
  setProductCategory, removeProductCategory,
  editReview, deleteReview
} from '../services/api'
import Image from '../components/Image'
import Stars from '../components/Stars'
import ShowMore from '../components/ShowMore'
import { strSort } from '../utils/functions'
import { ReactComponent as ReviewSVG } from '../assets/review.svg'
import { ReactComponent as CancelSVG } from '../assets/cancel.svg'
import { ReactComponent as PlusSVG } from '../assets/plus.svg'
import { ReactComponent as EditSVG } from '../assets/edit.svg'
import { ReactComponent as CheckSVG } from '../assets/check.svg'
import { ReactComponent as DeleteSVG } from '../assets/delete.svg'

export default (props) => {
  const defaultSlice = 9
  const { productId } = useParams()
  const history = useHistory()
  const hash = useLocation().hash
  const [product, setProduct] = useState()
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState('5')
  const [cachedReviews, setCachedReviews] = useState([])
  const [reviews, setReviews] = useState([])
  const [categories, setCategories] = useState([])
  const [productCategories, setProductCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [slice, setSlice] = useState(defaultSlice)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [userReview, setUserReview] = useState()
  const [showForm, setShowForm] = useState(false)

  let hasNoLinks = true

  const loadReviews = useCallback(() => {
    getProductReviews(productId).then(reviews => {
      setCachedReviews(reviews)
    })
  }, [productId])

  const loadProductCategories = useCallback(() => {
    getProductCategories(productId).then(categories => {
      setProductCategories(strSort(categories, 'name'))
    })
  }, [productId])

  useEffect(() => {
    if (props.isLogged && props.user) {
      const review = cachedReviews.find(
        review => review.userId === props.user.id
      )
      if (review) {
        setUserReview(review)
        setReviewText(review.text)
        setReviewRating(review.rating)
      }
      setReviews(cachedReviews.filter(e => e !== review))
    } else if (!props.isLogged) {
      setReviews(cachedReviews)
    }
  }, [cachedReviews, props.isLogged, props.user])

  useEffect(() => {
    getProduct(productId).then(product => {
      setProduct(product)
    })
    loadReviews()
  }, [props.user, productId, loadReviews])

  useEffect(() => {
    loadProductCategories()
  }, [loadProductCategories])

  useEffect(() => {
    !hasScrolled && reviews.forEach((review, i) => {
      if (hash.slice(1) === review.id && i >= slice) {
        setSlice(i + 1)
      }
    })
  }, [reviews, hash, slice, hasScrolled])

  useEffect(() => {
    if (props.user && props.user.type !== 'user') {
      getCategories().then(categories => {
        const productCategoryNames = productCategories.map(
          categ => categ.name
        )
        const newCategories = categories.filter(categ =>
          !productCategoryNames.includes(categ.name)
        )
        if (newCategories.length) {
          setSelectedCategory(newCategories[0].name)
        }
        setCategories(strSort(newCategories, 'name'))
      })
    }
  }, [props.user, productCategories])

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

  async function updateReview (e) {
    e.preventDefault()
    if (userReview.text !== reviewText ||
      userReview.rating !== reviewRating) {
      const review = {
        id: userReview.id,
        text: reviewText,
        rating: reviewRating
      }
      await editReview(review)
      loadReviews()
    }
    setShowForm(false)
  }

  async function remReview () {
    await deleteReview(userReview.id)
    setUserReview()
    setReviewText('')
    setReviewRating('5')
    loadReviews()
  }

  async function addProductCategory (e) {
    e.preventDefault()
    await setProductCategory(productId, selectedCategory)
    loadProductCategories()
  }

  async function remProductCategory (name) {
    await removeProductCategory(productId, name)
    loadProductCategories()
  }

  return (
    <>
      <h1>Produto</h1>

      {product &&
        <>
          {props.user && props.user.type !== 'user' &&
            <Alert className='border' variant='warning'>
              <h4>Zona de moderadores</h4>

              <Form onSubmit={addProductCategory}>
                <Form.Label>Adicione categorias a esse produto</Form.Label>
                <div className='d-flex'>
                  <Form.Control
                    as='select' value={selectedCategory} custom
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category =>
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    )}
                  </Form.Control>
                  <Button type='submit' className='ml-2'>
                    <PlusSVG className='wh-1-em' />
                  </Button>
                </div>
              </Form>

              <div className='my-2'>
                {productCategories.map(category =>
                  <Button
                    key={category.name}
                    variant='dark' className='m-1 rounded-pill'
                    onClick={() => remProductCategory(category.name)}
                  >
                    {category.name} <CancelSVG />
                  </Button>
                )}
              </div>

              <div className='text-right my-2'>
                <Button variant='outline-danger' onClick={remove}>
                    Deletar produto
                </Button>
              </div>
            </Alert>}

          <h3 className='word-break'>{product.name}</h3>

          <div className='mb-4'>
            {(props.user && props.user.type !== 'user') || productCategories.map(category =>
              <span key={category.name}>
                <Badge
                  key={category.name}
                  pill variant='dark'
                >
                  {category.name}
                </Badge>
                &nbsp;
              </span>
            )}
          </div>

          {product.description.trim()
            ? <div className='space-break'>{product.description.trim()}</div>
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

          {((props.user && !userReview) || showForm) &&
            <Form
              className='py-3'
              onSubmit={(userReview && updateReview) || submitReview}
            >
              <Form.Row>
                <Col xs={12} md={10} lg={11}>
                  <Form.Group>
                    <Form.Control
                      placeholder='Deixe seu comentário aqui'
                      as='textarea' rows='3' value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={3} md={2} lg={1}>
                  <Form.Group>
                    <Form.Control
                      placeholder='Deixe seu comentário aqui' maxLength='500'
                      as='select' rows='3' value={reviewRating}
                      onChange={e => setReviewRating(e.target.value)}
                    >
                      <option value='1'>1</option>
                      <option value='2'>2</option>
                      <option value='3'>3</option>
                      <option value='4'>4</option>
                      <option value='5'>5</option>
                    </Form.Control>
                  </Form.Group>

                  {(userReview &&
                    <Button
                      type='submit'
                      variant='outline-primary'
                    >
                      <CheckSVG />
                    </Button>) ||
                      <Button type='submit'>
                        <ReviewSVG className='wh-1-em' />
                      </Button>}

                </Col>
              </Form.Row>
            </Form>}

          {(userReview && !showForm) &&
            <div
              id={userReview.id}
              ref={ref => {
                if (ref && !hasScrolled &&
                  hash.slice(1) === userReview.id) {
                  ref.scrollIntoView()
                  setHasScrolled(true)
                }
              }}
              className={'py-3 mb-3 d-flex ' +
                (hash.slice(1) === userReview.id ? 'bg-light' : '')}
            >
              <div>
                <Image
                  width='128px'
                  src={`/api/images/${userReview.User.image}`}
                />
              </div>
              <div className='ml-3 flex-fill space-break'>
                <div className='d-flex align-items-stretch mb-2'>
                  <h5 className='d-flex align-items-center m-0'>
                    <b>Minha Avaliação</b>
                  </h5>
                  <div className='flex-fill text-right'>
                    <Button
                      className='border-0'
                      variant='outline-dark'
                      onClick={() => setShowForm(true)}
                    >
                      <EditSVG />
                    </Button>
                    <Button
                      className='border-0'
                      variant='outline-danger'
                      onClick={remReview}
                    >
                      <DeleteSVG />
                    </Button>
                  </div>
                </div>
                {userReview.text.trim()
                  ? <p>{userReview.text.trim()}</p>
                  : <p className='text-muted'>Sem comentário</p>}
                <div
                  className='small text-muted'
                  title={'Atualizado em: ' + new Date(userReview.updatedAt).toLocaleString()}
                >
                  Criado em: {new Date(userReview.createdAt).toLocaleString()}
                </div>
                <Stars value={Number(userReview.rating)} />
              </div>
            </div>}

          {reviews.slice(0, slice).map((review, i) =>
            <div
              key={i} id={review.id}
              ref={ref => {
                if (ref && !hasScrolled &&
                  hash.slice(1) === review.id) {
                  ref.scrollIntoView()
                  setHasScrolled(true)
                }
              }}
              className={'py-3 d-flex ' +
                (hash.slice(1) === review.id ? 'bg-light' : '')}
            >
              <div>
                <Image
                  width='128px'
                  src={`/api/images/${review.User.image}`}
                />
              </div>
              <div className='ml-3 space-break'>
                <p><b>{review.User.name}</b></p>
                {review.text.trim()
                  ? <p>{review.text.trim()}</p>
                  : <p className='text-muted'>Sem comentário</p>}
                <div
                  className='small text-muted'
                  title={'Atualizado em: ' + new Date(review.updatedAt).toLocaleString()}
                >
                  Criado em: {new Date(review.createdAt).toLocaleString()}
                </div>
                <Stars value={Number(review.rating)} />
              </div>
            </div>
          )}
          <ShowMore
            slice={slice} defaultSlice={defaultSlice}
            setSlice={setSlice} length={reviews.length}
          />
        </>}
    </>
  )
}
