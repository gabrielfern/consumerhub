import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { getStagingProducts } from '../services/api'

export default (props) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    if (props.user) {
      getStagingProducts().then(products => {
        setProducts(products)
      })
    }
  }, [props.user])

  return (
    <>
      <h1>Produtos</h1>

      {props.isLogged &&
        <>
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
        </>}
    </>
  )
}
