import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { getProducts, getProductReviews } from '../services/api'
import Image from '../components/Image'
import Stars from '../components/Stars'

export default (props) => {
  const [cachedProducts, setCachedProducts] = useState([])
  const [products, setProducts] = useState([])
  const search = new URLSearchParams(useLocation().search).get('s')
  const [reviews, setReviews] = useState({})

  useEffect(() => {
    getProducts().then(products => {
      setCachedProducts(products)
      products.map(async product => {
        const productReviews = await getProductReviews(product.id)
        setReviews(reviews => ({
          ...reviews, [product.id]: productReviews
        }))
      })
    })
  }, [])

  useEffect(() => {
    if (search) {
      setProducts(cachedProducts.filter(product => {
        if (product.name) {
          return product.name.toLowerCase().includes(search.toLowerCase())
        }
        return false
      }))
    } else {
      setProducts(cachedProducts)
    }
  }, [cachedProducts, search])

  function productStars (reviews) {
    if (reviews && reviews.length) {
      return reviews.reduce((acc, cur) => acc + Number(cur.rating), 0) / reviews.length
    } else {
      return 0
    }
  }

  return (
    <>
      <h1>Produtos</h1>

      {props.user &&
        <Button as={Link} to='/products/new' variant='outline-primary'>
          Criar produto
        </Button>}
      <div className='d-flex flex-wrap justify-content-around align-items-stretch'>
        {products.map((product, i) =>
          <Link className='text-reset text-decoration-none d-flex' key={i} to={`/product/${product.id}`}>
            <Card className='my-3 flex-fill' style={{ width: '320px' }}>
              <Card.Header>
                <h4>
                  {product.name || 'Produto sem nome'}
                </h4>
              </Card.Header>
              <Image
                width='320px'
                src={`/api/products/${product.id}/image/1`}
              />
              <Card.Body className='flex-fill'>
                {product.description.slice(0, 200) ||
                  <span className='text-muted'>Produto sem descrição</span>}
                {product.description.length > 200 &&
                  <span>...</span>}
              </Card.Body>
              <Card.Footer className='d-flex'>
                <Stars
                  value={
                    productStars(reviews[product.id])
                  }
                />
                <span className='flex-fill text-right'>
                  {reviews[product.id] && reviews[product.id].length} avaliações
                </span>
              </Card.Footer>
            </Card>
          </Link>
        )}
      </div>
    </>
  )
}
