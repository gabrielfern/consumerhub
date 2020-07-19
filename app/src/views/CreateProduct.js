import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createProduct, uploadProductImage } from '../services/api'

export default () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image1, setImage1] = useState({})
  const [image2, setImage2] = useState({})
  const [image3, setImage3] = useState({})
  const [image4, setImage4] = useState({})
  const [image5, setImage5] = useState({})

  async function submit () {
    const product = await createProduct({ name, description })
    if (product) {
      if (image1 && image1.size > 0) {
        await uploadProductImage(product.id, 1, await image1.arrayBuffer())
      }
      if (image2 && image2.size > 0) {
        await uploadProductImage(product.id, 2, await image2.arrayBuffer())
      }
      if (image3 && image3.size > 0) {
        await uploadProductImage(product.id, 3, await image3.arrayBuffer())
      }
      if (image4 && image4.size > 0) {
        await uploadProductImage(product.id, 4, await image4.arrayBuffer())
      }
      if (image5 && image5.size > 0) {
        await uploadProductImage(product.id, 5, await image5.arrayBuffer())
      }
      history.push(`/product/${product.id}`)
    }
  }

  return (
    <>
      <div>
        <h1>Criar novo produto</h1>
        <p>
          <button onClick={() => history.push('/products')}>Produtos</button>
        </p>
        <p>
          <span><b>Nome </b></span>
          <input type='text' value={name} onChange={e => setName(e.target.value)} />
        </p>
        <p>
          <span><b>Descrição </b></span>
          <input type='text' value={description} onChange={e => setDescription(e.target.value)} />
        </p>
        <p>
          <span><b>Imagem 1 </b></span>
          <input type='file' accept='image/*' onChange={e => setImage1(e.target.files[0])} />
        </p>
        <p>
          <span><b>Imagem 2 </b></span>
          <input type='file' accept='image/*' onChange={e => setImage2(e.target.files[0])} />
        </p>
        <p>
          <span><b>Imagem 3 </b></span>
          <input type='file' accept='image/*' onChange={e => setImage3(e.target.files[0])} />
        </p>
        <p>
          <span><b>Imagem 4 </b></span>
          <input type='file' accept='image/*' onChange={e => setImage4(e.target.files[0])} />
        </p>
        <p>
          <span><b>Imagem 5 </b></span>
          <input type='file' accept='image/*' onChange={e => setImage5(e.target.files[0])} />
        </p>
        <p>
          <button onClick={submit}>Confirmar</button>
        </p>
      </div>
    </>
  )
}
