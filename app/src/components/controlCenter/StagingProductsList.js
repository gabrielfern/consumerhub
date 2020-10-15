import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import { getStagingProducts } from '../../services/api'

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
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ID de usuário</th>
            <th>ID de produto</th>
            <th>Nome do produto</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => {
            return (
              <tr key={i}>
                <td><Link to={`/staging?id=${product.id}&userId=${product.userId}`}>{i + 1}</Link></td>
                <td><Link to={`/user/${product.userId}`}>{product.userId}</Link></td>
                <td>
                  {product.isNewProduct ? <Badge variant='secondary'>Novo</Badge>
                    : <Link to={`/product/${product.id}`}>{product.id}</Link>}
                </td>
                <td className='word-break'>{product.name}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}
