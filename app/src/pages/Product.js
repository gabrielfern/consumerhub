import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../services/api'
import Image from '../components/Image'

export default (props) => {
  const { productId } = useParams()
  const [product, setProduct] = useState()

  useEffect(() => {
    if (props.user) {
      getProduct(productId).then(product => {
        setProduct(product)
      })
    }
  }, [props.user, productId])

  return (
    <>
      <h1>Produto</h1>

      {product &&
        <>
          <p><b>ID:</b> {product.id}</p>
          <p><b>Nome:</b> {product.name}</p>
          <p><b>Descrição:</b> {product.description}</p>

          <hr />
          <h4>Imagens do produto</h4>
          <div style={{ overflowX: 'auto' }}>
            <div
              className='d-flex justify-content-between align-items-center'
              style={{ width: 2550, height: 550 }}
            >
              {[...Array(5).keys()].map((i) =>
                <Image
                  key={i}
                  width='500px'
                  src={`/api/products/${product.id}/image/${i + 1}`}
                />
              )}
            </div>
          </div>

          <hr />
          <h4>Links</h4>
          {[1, 2, 3].map(i =>
            <p key={i}>
              <a href={product[`link${i}`]}>{product[`link${i}`]}</a>
            </p>
          )}
        </>}
    </>
  )
}
