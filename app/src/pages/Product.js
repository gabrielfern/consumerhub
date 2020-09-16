import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct } from '../services/api'

export default (props) => {
  const { productId } = useParams()
  const [product, setProduct] = useState()
  const [hadError, setHadError] = useState(Array(5).fill(false))

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
              {hadError.map((value, i) =>
                <div key={i} style={{ width: 500, height: 500 }}>
                  {(!value &&
                    <img
                      className='rounded'
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      src={`/api/products/${product.id}/image/${i + 1}`}
                      alt='imagem de produto'
                      onError={() => {
                        setHadError(hadError => {
                          const newHadError = hadError.slice()
                          newHadError[i] = true
                          return newHadError
                        })
                      }}
                    />) || <div className='user-image-replacement rounded' />}
                </div>
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
