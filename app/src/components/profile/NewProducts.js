import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getStagingProducts } from '../../services/api'
import NothingHere from '../NothingHere'
import ShowMore from '../ShowMore'

export default (props) => {
  const defaultSlice = 12
  const [products, setProducts] = useState([])
  const [slice, setSlice] = useState(defaultSlice)

  useEffect(() => {
    if (props.user) {
      getStagingProducts(props.user.id).then(products => {
        setProducts(products)
      })
    }
  }, [props.user])

  return (
    (products.length &&
      <>
        <Row xs={1} md={1} lg={2} xl={3} noGutters>
          {products.slice(0, slice).map((product, i) =>
            <Col key={i} className='p-1 d-flex flex-column space-break'>
              <div className='flex-fill d-flex flex-column border rounded p-3'>
                <Link to={`/staging?id=${product.id}&userId=${product.userId}`}>
                  {product.name}
                </Link>
                {(product.description && product.description.trim().slice(0, 200) &&
                  <p className='flex-fill space-break'>
                    {product.description.trim().slice(0, 200)}
                    {product.description.trim().length > 200 &&
                      <span>...</span>}
                  </p>) || <p className='text-muted'>Sem descrição</p>}
              </div>
            </Col>
          )}
        </Row>
        <ShowMore
          slice={slice} defaultSlice={defaultSlice}
          setSlice={setSlice} length={products.length}
        />
      </>) || <NothingHere />
  )
}
