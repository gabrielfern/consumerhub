import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useHistory, useLocation, Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Dropdown from 'react-bootstrap/Dropdown'
import {
  getProduct, deleteProduct, getProductReviews,
  createReview, getProductCategories, getCategories,
  setProductCategory, removeProductCategory,
  editReview, deleteReview, voteReview, deleteReviewVote,
  createStagingProduct as createStagingProductAPI
} from '../services/api'
import Image from '../components/Image'
import Stars from '../components/Stars'
import ShowMore from '../components/ShowMore'
import Report from '../components/Report'
import { strSort, productStars } from '../utils/functions'
import { ReactComponent as ReviewSVG } from '../assets/review.svg'
import { ReactComponent as CancelSVG } from '../assets/cancel.svg'
import { ReactComponent as PlusSVG } from '../assets/plus.svg'
import { ReactComponent as EditSVG } from '../assets/edit.svg'
import { ReactComponent as CheckSVG } from '../assets/check.svg'
import { ReactComponent as DeleteSVG } from '../assets/delete.svg'
import { ReactComponent as ThumbUpSVG } from '../assets/thumb_up.svg'
import { ReactComponent as ThumbDownSVG } from '../assets/thumb_down.svg'
import { ReactComponent as ThumbUpFilledSVG } from '../assets/thumb_up_filled.svg'
import { ReactComponent as ThumbDownFilledSVG } from '../assets/thumb_down_filled.svg'

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
  const [showWithoutComment, setShowWithoutComment] = useState(true)
  const [selectedSorting, setSelectedSorting] = useState('createdAt')
  const [showProductReportModal, setShowProductReportModal] = useState(false)
  const [showReviewReportModal, setShowReviewReportModal] = useState(false)
  const [reportReviewId, setReportReviewId] = useState('')

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

  const filterComments = useCallback((reviews) => {
    return reviews.filter(review => {
      if (!showWithoutComment && !review.text.trim()) {
        return false
      }
      return true
    })
  }, [showWithoutComment])

  const sortReviews = useCallback((reviews) => {
    reviews = reviews.slice()
    switch (selectedSorting) {
      case 'votesCount':
        return reviews.sort((a, b) =>
          (a.votes.upvotes + a.votes.downvotes) >
          (b.votes.upvotes + b.votes.downvotes) ? -1 : 1
        )
      case 'votesBalance':
        return reviews.sort((a, b) =>
          (a.votes.upvotes - a.votes.downvotes) >
          (b.votes.upvotes - b.votes.downvotes) ? -1 : 1
        )
      case 'biggestRating':
        return reviews.sort((a, b) =>
          a.rating > b.rating ? -1 : 1
        )
      case 'smallestRating':
        return reviews.sort((a, b) =>
          a.rating < b.rating ? -1 : 1
        )
      case 'updatedAt':
        return reviews.sort((a, b) =>
          new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1
        )
      default:
        return reviews.sort((a, b) =>
          new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1
        )
    }
  }, [selectedSorting])

  useEffect(() => {
    getProduct(productId).then(product => {
      setProduct(product)
    })
    loadReviews()
  }, [productId, loadReviews])

  useEffect(() => {
    loadProductCategories()
  }, [loadProductCategories])

  useEffect(() => {
    if (props.isLogged && props.user) {
      const review = cachedReviews.find(
        review => review.userId === props.user.id
      )
      if (review) {
        setUserReview(review)
        if (!showForm) {
          setReviewText(review.text)
          setReviewRating(review.rating)
        }
      }
      let newReviews = cachedReviews.filter(e => e !== review)
      newReviews = sortReviews(filterComments(newReviews))
      setReviews(newReviews)
    } else if (!props.isLogged) {
      const newReviews = sortReviews(filterComments(cachedReviews))
      setReviews(newReviews)
    }
  }, [
    cachedReviews, props.isLogged, props.user,
    filterComments, sortReviews, showForm
  ])

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
    if (window.confirm('Realmente excluir este produto?')) {
      await deleteProduct(product.id)
      history.push('/products')
    }
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

  async function remReview (reviewId) {
    if (window.confirm('Realmente excluir avaliação?')) {
      await deleteReview(reviewId)
      setUserReview()
      setReviewText('')
      setReviewRating('5')
      loadReviews()
    }
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

  async function upVote (review) {
    if (review.votes.voted === 'upvote') {
      await deleteReviewVote(review.id)
    } else {
      await voteReview(review.id, 'upvote')
    }
    loadReviews()
  }

  async function downVote (review) {
    if (review.votes.voted === 'downvote') {
      await deleteReviewVote(review.id)
    } else {
      await voteReview(review.id, 'downvote')
    }
    loadReviews()
  }

  function showReport (reviewId) {
    if (reviewId) {
      setReportReviewId(reviewId)
      setShowReviewReportModal(true)
    } else {
      setShowProductReportModal(true)
    }
  }

  async function createStagingProduct () {
    const resp = await createStagingProductAPI(product.id)
    if (resp) {
      history.push(`/staging?id=${resp.id}&userId=${props.user.id}`)
    } else {
      window.alert('Um erro ocorreu')
    }
  }

  return (
    <>
      <h1>Produto</h1>

      {product &&
        <>
          {props.user && props.user.type !== 'user' &&
            <Alert variant='warning'>
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

              <div className='text-right mt-3'>
                <Button variant='outline-danger' onClick={remove}>
                    Excluir Produto
                </Button>
              </div>
            </Alert>}

          <div className='word-break d-flex'>
            <h3>{product.name}</h3>
            <div className='flex-fill text-right'>
              {props.user &&
                <Dropdown alignRight>
                  <Dropdown.Toggle
                    className='border-0'
                    variant='outline-dark'
                  />
                  <Dropdown.Menu>
                    <Dropdown.Item
                      className='text-primary'
                      onClick={createStagingProduct}
                    >
                      Editar
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => showReport()}>
                      Reportar
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>}
            </div>
          </div>

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
                      as='select' custom value={reviewRating}
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
                    <Button type='submit'>
                      <CheckSVG className='wh-1-em' />
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
              className={'py-3 d-flex ' +
                (hash.slice(1) === userReview.id ? 'bg-light' : '')}
            >
              <div>
                <Image
                  width='128px'
                  src={`/api/images/${userReview.User.image}`}
                />
              </div>
              <div className='ml-3 flex-fill space-break'>
                <div className='d-flex align-items-stretch mb-2 mt-n3'>
                  <h5 className='d-flex align-items-center m-0'>
                    <b>Minha Avaliação</b>
                  </h5>
                  <div className='flex-fill text-right'>
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-dark'
                      onClick={() => setShowForm(true)}
                    >
                      <EditSVG />
                    </Button>
                    <Button
                      className='border-0 p-2 m-1'
                      variant='outline-danger'
                      onClick={() => remReview(userReview.id)}
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
                <div className='d-flex'>
                  <div className='d-flex align-items-center'>
                    <Stars value={Number(userReview.rating)} />
                  </div>
                  <div className='flex-fill text-right'>
                    <div className='d-inline-block'>
                      <Button
                        className='border-0 p-2 m-1'
                        variant='outline-secondary'
                        onClick={() => upVote(userReview)}
                      >
                        {userReview.votes.voted === 'upvote'
                          ? <ThumbUpFilledSVG /> : <ThumbUpSVG />}
                      </Button>
                      {userReview.votes.upvotes}
                    </div>
                    <div className='d-inline-block'>
                      <Button
                        className='border-0 p-2 m-1'
                        variant='outline-secondary'
                        onClick={() => downVote(userReview)}
                      >
                        {userReview.votes.voted === 'downvote'
                          ? <ThumbDownFilledSVG /> : <ThumbDownSVG />}
                      </Button>
                      {userReview.votes.downvotes}
                    </div>
                  </div>
                </div>
              </div>
            </div>}

          <Row className='py-3 mb-3'>
            <Col xs={12} md={6} className='d-flex flex-column align-items-stretch'>
              <div className='d-flex mb-3'>
                <Stars
                  value={
                    productStars(cachedReviews)
                  }
                />
                <span className='flex-fill text-right'>
                  {cachedReviews && cachedReviews.length +
                    (cachedReviews.length === 1 ? ' avaliação' : ' avaliações')}
                </span>
              </div>
              <div key='checkbox' className='flex-fill d-flex align-items-end mb-3'>
                <Form.Check
                  type='checkbox' checked={showWithoutComment} custom
                  onChange={e => setShowWithoutComment(e.target.checked)}
                  id='checkbox' label='Mostrar avaliações sem comentários'
                />
              </div>
            </Col>
            <Col xs={12} md={6}>
              <Form.Label>Ordenar avaliações por</Form.Label>
              <Form.Control
                as='select' custom value={selectedSorting}
                onChange={e => setSelectedSorting(e.target.value)}
              >
                <option value='createdAt'>Data de criação</option>
                <option value='updatedAt'>Recém editados</option>
                <option value='votesCount'>Mais votos</option>
                <option value='votesBalance'>Mais bem votados</option>
                <option value='biggestRating'>Melhor nota</option>
                <option value='smallestRating'>Pior nota</option>
              </Form.Control>
            </Col>
          </Row>

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
                <Link to={`/user/${review.userId}`}>
                  <Image
                    width='128px'
                    src={`/api/images/${review.User.image}`}
                  />
                </Link>
              </div>
              <div className='ml-3 flex-fill space-break'>
                <div className={'d-flex align-items-stretch mb-2 ' + (props.user ? 'mt-n2' : '')}>
                  <p className='d-flex align-items-center m-0'>
                    <Link to={`/user/${review.userId}`}>
                      <b>{review.User.name}</b>
                    </Link>
                  </p>
                  <div className='flex-fill text-right'>
                    {props.user &&
                      <Dropdown alignRight>
                        <Dropdown.Toggle
                          className='border-0'
                          variant='outline-dark'
                        />
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => showReport(review.id)}>
                            Reportar
                          </Dropdown.Item>
                          {props.user.type !== 'user' &&
                            <Dropdown.Item
                              className='text-danger'
                              onClick={() => remReview(review.id)}
                            >
                              Excluir
                            </Dropdown.Item>}
                        </Dropdown.Menu>
                      </Dropdown>}
                  </div>
                </div>
                {review.text.trim()
                  ? <p>{review.text.trim()}</p>
                  : <p className='text-muted'>Sem comentário</p>}
                <div
                  className='small text-muted'
                  title={'Atualizado em: ' + new Date(review.updatedAt).toLocaleString()}
                >
                  Criado em: {new Date(review.createdAt).toLocaleString()}
                </div>
                <div className='d-flex'>
                  <div className='d-flex align-items-center'>
                    <Stars value={Number(review.rating)} />
                  </div>
                  <div className='flex-fill text-right'>
                    <div className='d-inline-block'>
                      <Button
                        className='border-0 p-2 m-1'
                        disabled={!props.user}
                        variant='outline-secondary'
                        onClick={() => upVote(review)}
                      >
                        {review.votes.voted === 'upvote'
                          ? <ThumbUpFilledSVG /> : <ThumbUpSVG />}
                      </Button>
                      {review.votes.upvotes}
                    </div>
                    <div className='d-inline-block'>
                      <Button
                        className='border-0 p-2 m-1'
                        disabled={!props.user}
                        variant='outline-secondary'
                        onClick={() => downVote(review)}
                      >
                        {review.votes.voted === 'downvote'
                          ? <ThumbDownFilledSVG /> : <ThumbDownSVG />}
                      </Button>
                      {review.votes.downvotes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <ShowMore
            slice={slice} defaultSlice={defaultSlice}
            setSlice={setSlice} length={reviews.length}
          />
        </>}

      {props.user && product &&
        <>
          <Report
            showModal={showProductReportModal} setShowModal={setShowProductReportModal}
            type='products' idName='productId' idValue={product.id}
          />
          <Report
            showModal={showReviewReportModal} setShowModal={setShowReviewReportModal}
            type='reviews' idName='reviewId' idValue={reportReviewId}
          />
        </>}
    </>
  )
}
