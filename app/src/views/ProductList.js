/* global localStorage */
import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { getProducts } from '../services/api'

export default () => {
  const history = useHistory()
  const [products, setProducts] = useState([])

  useEffect(() => {
    (async () => {
      try {
        setProducts(await getProducts())
      } catch {}
    })()
  }, [])

  return (
    <div className='container my-3'>
      <h1>Lista de Produtos</h1>
      {
        (localStorage.token &&
          <div className='my-3'>
            <button className='btn btn-secondary m-2' onClick={() => history.push('/profile')}>Perfil de usuário</button>
            <button className='btn btn-secondary m-2' onClick={() => history.push('/products/new')}>Criar produto</button>
          </div>) ||
            <div className='my-3'>
              <button className='btn btn-secondary m-2' onClick={() => history.push('/signup')}>Cadastrar</button>
              <button className='btn btn-secondary m-2' onClick={() => history.push('/')}>Logar</button>
            </div>
      }
      {products.map(product =>
        <p key={product.id}>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </p>
      )}
    </div>
  )
}
