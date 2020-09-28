import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { getProducts } from '../services/api'

export default (props) => {
  const [cachedProducts, setCachedProducts] = useState([])
  const [products, setProducts] = useState([])
  const search = new URLSearchParams(useLocation().search).get('s')

  useEffect(() => {
    getProducts().then(products => {
      setCachedProducts(products)
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

  return (
    <>
      <h1>Produtos</h1>

      <Button as={Link} to='/products/new' variant='outline-primary'>
        Criar produto
      </Button>
      {products.map(product =>
        <Link key={product.id} to={`/product/${product.id}`}>
          <div className='border-top rounded my-3 p-3'>
            <p><span className='text-muted'>ID:</span> {product.id}</p>
            <p><span className='text-muted'>Nome:</span> {product.name}</p>
          </div>
        </Link>
      )}
    </>
  )
}
