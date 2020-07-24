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
    <div className='container my-3'>
      <h1>Criar novo produto</h1>
      <div className='my-3'>
        <button className='btn btn-secondary m-2' onClick={() => history.push('/products')}>Produtos</button>
      </div>
      <div className='my-3'>
        <span><b>Nome </b></span>
        <input className='form-control' type='text' value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className='my-3'>
        <span><b>Descrição </b></span>
        <input className='form-control' type='text' value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className='custom-file my-3'>
        <input
          type='file' className='custom-file-input'
          onChange={e => {
            const fileLabel1 = document.getElementById('fileLabel1')
            if (e.target.files[0]) {
              fileLabel1.innerText = e.target.files[0].name
            } else {
              fileLabel1.innerText = 'Escolha a imagem 1'
            }
            setImage1(e.target.files[0])
          }}
        />
        <label id='fileLabel1' className='custom-file-label'>Escolha a imagem 1</label>
      </div>
      <div className='custom-file my-3'>
        <input
          type='file' className='custom-file-input'
          onChange={e => {
            const fileLabel2 = document.getElementById('fileLabel2')
            if (e.target.files[0]) {
              fileLabel2.innerText = e.target.files[0].name
            } else {
              fileLabel2.innerText = 'Escolha a imagem 2'
            }
            setImage2(e.target.files[0])
          }}
        />
        <label id='fileLabel2' className='custom-file-label'>Escolha a imagem 2</label>
      </div>
      <div className='custom-file my-3'>
        <input
          type='file' className='custom-file-input'
          onChange={e => {
            const fileLabel3 = document.getElementById('fileLabel3')
            if (e.target.files[0]) {
              fileLabel3.innerText = e.target.files[0].name
            } else {
              fileLabel3.innerText = 'Escolha a imagem 3'
            }
            setImage3(e.target.files[0])
          }}
        />
        <label id='fileLabel3' className='custom-file-label'>Escolha a imagem 3</label>
      </div>
      <div className='custom-file my-3'>
        <input
          type='file' className='custom-file-input'
          onChange={e => {
            const fileLabel4 = document.getElementById('fileLabel4')
            if (e.target.files[0]) {
              fileLabel4.innerText = e.target.files[0].name
            } else {
              fileLabel4.innerText = 'Escolha a imagem 4'
            }
            setImage4(e.target.files[0])
          }}
        />
        <label id='fileLabel4' className='custom-file-label'>Escolha a imagem 4</label>
      </div>
      <div className='custom-file my-3'>
        <input
          type='file' className='custom-file-input'
          onChange={e => {
            const fileLabel5 = document.getElementById('fileLabel5')
            if (e.target.files[0]) {
              fileLabel5.innerText = e.target.files[0].name
            } else {
              fileLabel5.innerText = 'Escolha a imagem 5'
            }
            setImage5(e.target.files[0])
          }}
        />
        <label id='fileLabel5' className='custom-file-label'>Escolha a imagem 5</label>
      </div>
      <div>
        <button className='btn btn-primary m-2' onClick={submit}>Confirmar</button>
      </div>
    </div>
  )
}
