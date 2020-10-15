import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getProducts, getProductReviews, getCategories } from '../services/api'
import Image from '../components/Image'
import Stars from '../components/Stars'
import NothingHere from '../components/NothingHere'
import ShowMore from '../components/ShowMore'
import { strNorm, strSort, productStars } from '../utils/functions'
import { ReactComponent as PlusSVG } from '../assets/plus.svg'
import { ReactComponent as CancelSVG } from '../assets/cancel.svg'

export default (props) => {
  const defaultSlice = 9
  const history = useHistory()
  const query = useLocation().search
  const search = new URLSearchParams(query).get('s')
  const querySorting = new URLSearchParams(query).get('sort') || 'name'
  const queryCategs = useMemo(() =>
    strSort(new Set(new URLSearchParams(query).getAll('categs'))),
  [query])

  const [cachedProducts, setCachedProducts] = useState([])
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState({})
  const [cachedCategories, setCachedCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [slice, setSlice] = useState(defaultSlice)

  const searchFilter = useCallback((products) => {
    if (search) {
      return products.filter(product => {
        if (product.name) {
          return strNorm(product.name).includes(strNorm(search)) ||
          strNorm(product.description).includes(strNorm(search))
        }
        return false
      })
    }
    return [...products]
  }, [search])

  const categoriesFilter = useCallback((products) => {
    if (selectedCategories.length) {
      return products.filter(prod => {
        const prodCategNames = prod.Categories.map(
          categ => categ.name
        )
        return selectedCategories.every(
          categ => prodCategNames.includes(categ)
        )
      })
    }
    return [...products]
  }, [selectedCategories])

  const sort = useCallback((products) => {
    products = strSort(products, 'name')
    switch (querySorting) {
      case 'createdAt':
        return products.sort((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1
        )
      case 'updatedAt':
        return products.sort((a, b) =>
          new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1
        )
      case 'reviewCount':
        return products.sort((a, b) =>
          (reviews[a.id] && reviews[a.id].length) >
          (reviews[b.id] && reviews[b.id].length) ? -1 : 1
        )
      case 'rating':
        return products.sort((a, b) =>
          productStars(reviews[a.id]) > productStars(reviews[b.id]) ? -1 : 1
        )
      default:
        return products
    }
  }, [querySorting, reviews])

  useEffect(() => {
    getProducts().then(products => {
      if (products) {
        setCachedProducts(products)
        products.map(async product => {
          const productReviews = await getProductReviews(product.id)
          setReviews(reviews => ({
            ...reviews, [product.id]: productReviews
          }))
        })
      }
    })

    getCategories().then(categs => {
      setCachedCategories(strSort(categs.map(categ => categ.name)))
    })
  }, [])

  useEffect(() => {
    setSelectedCategories(queryCategs.filter(categ => cachedCategories.includes(categ)))
    setCategories(cachedCategories.filter(categ => !queryCategs.includes(categ)))
  }, [queryCategs, cachedCategories])

  useEffect(() => {
    setProducts(categoriesFilter(searchFilter(sort(cachedProducts))))
  }, [
    cachedProducts, searchFilter, categoriesFilter, sort
  ])

  useEffect(() => {
    if (categories.length) {
      setSelectedCategory(categories[0])
    } else {
      setSelectedCategory('')
    }
  }, [categories])

  function addCategory () {
    if (selectedCategory) {
      const newQuery = new URLSearchParams(query)
      newQuery.append('categs', selectedCategory)
      window.newQuery = newQuery
      history.push({
        search: newQuery.toString()
      })
    }
  }

  function remCategory (name) {
    const newQuery = new URLSearchParams(query)
    const categs = newQuery.getAll('categs')
    newQuery.delete('categs')
    categs.forEach(categ =>
      categ !== name && newQuery.append('categs', categ)
    )
    history.push({
      search: newQuery.toString()
    })
  }

  function changeSorting (e) {
    const newQuery = new URLSearchParams(query)
    newQuery.delete('sort')
    if (e.target.value !== 'name') {
      newQuery.append('sort', e.target.value)
    }
    history.push({
      search: newQuery.toString()
    })
  }

  return (
    <>
      <h1>Produtos</h1>

      {props.user &&
        <Button as={Link} to='/products/new' variant='outline-primary'>
          Criar produto
        </Button>}

      <Row className='mt-3'>
        <Col xs={12} md={6} className='my-1'>
          <Form.Label>Ordenar produtos por</Form.Label>
          <Form.Control
            as='select' value={querySorting} custom
            onChange={changeSorting}
          >
            <option value='name'>Nome</option>
            <option value='createdAt'>Recém criados</option>
            <option value='updatedAt'>Recém atualizados</option>
            <option value='reviewCount'>Mais avaliações</option>
            <option value='rating'>Melhor nota</option>
          </Form.Control>
        </Col>
        <Col xs={12} md={6} className='my-1'>
          <Form.Label>Filtrar produtos por categorias</Form.Label>
          <div className='d-flex'>
            <Form.Control
              as='select' value={selectedCategory} custom
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(category =>
                <option key={category} value={category}>
                  {category}
                </option>
              )}
            </Form.Control>
            <Button onClick={addCategory} className='ml-2'>
              <PlusSVG className='wh-1-em' />
            </Button>
          </div>
        </Col>
        <Col className='my-1'>
          {selectedCategories.map(category =>
            <Button
              key={category}
              variant='dark' className='m-1 rounded-pill'
              onClick={() => remCategory(category)}
            >
              {category} <CancelSVG />
            </Button>
          )}
        </Col>
      </Row>

      <p className='text-muted'>
        {!!products.length && products.length + ' Resultado' +
          (products.length === 1 ? '' : 's')}
      </p>
      {(products.length &&
        <>
          <div className='d-flex flex-wrap justify-content-around align-items-stretch'>
            {products.slice(0, slice).map((product, i) =>
              <Link className='text-reset text-decoration-none d-flex' key={i} to={`/product/${product.id}`}>
                <Card className='my-3 flex-fill' style={{ width: '320px' }}>
                  <Card.Header>
                    <h4>
                      {product.name || 'Produto sem nome'}
                    </h4>
                  </Card.Header>
                  <Image
                    width='320px'
                    src={`/api/images/${product.image1}`}
                  />
                  <Card.Body className='flex-fill'>
                    {product.description.trim().slice(0, 200) ||
                      <span className='text-muted'>Produto sem descrição</span>}
                    {product.description.trim().length > 200 &&
                      <span>...</span>}
                  </Card.Body>
                  <Card.Footer className='d-flex'>
                    <Stars
                      value={
                        productStars(reviews[product.id])
                      }
                    />
                    <span className='flex-fill text-right'>
                      {reviews[product.id] && reviews[product.id].length +
                        (reviews[product.id].length === 1 ? ' avaliação' : ' avaliações')}
                    </span>
                  </Card.Footer>
                </Card>
              </Link>
            )}
          </div>
          <ShowMore
            slice={slice} defaultSlice={defaultSlice}
            setSlice={setSlice} length={products.length}
          />
        </>) || <NothingHere text='Nenhum produto encontrado' />}
    </>
  )
}
