import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getStagingProduct, getStagingProductImage } from '../services/api'

export default (props) => {
  const { productId } = useParams()
  const [product, setProduct] = useState([])
  const [imageURLs, setImageURLs] = useState(Array(5).fill(''))

  useEffect(() => {
    if (props.user) {
      getStagingProduct(productId).then(product => {
        setProduct(product[0])
        Array(5).fill().forEach((_, i) => {
          getStagingProductImage(product[0].id, i + 1).then(image => {
            if (image.size > 0) {
              setImageURLs(imageURLs => {
                const newImageURLs = imageURLs.slice()
                newImageURLs[i] = URL.createObjectURL(image)
                return newImageURLs
              })
            }
          })
        })
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
              {imageURLs.map((imageURL, i) =>
                <div key={i} style={{ width: 500, height: 500 }}>
                  {(imageURL &&
                    <img
                      className='rounded'
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      src={imageURL}
                      alt='imagem de produto'
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
