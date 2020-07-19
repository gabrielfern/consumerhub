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
    <>
      <div>
        <h1>Lista de Produtos</h1>
        {
          (localStorage.token &&
            <p>
              <button onClick={() => history.push('/profile')}>Perfil de usuário</button>
              <button onClick={() => history.push('/products/new')}>Criar produto</button>
            </p>) ||
              <p>
                <button onClick={() => history.push('/signup')}>Cadastrar</button>
                <button onClick={() => history.push('/')}>Logar</button>
              </p>
        }
        {products.map(product =>
          <p key={product.id}>
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </p>
        )}
      </div>
    </>
  )
}
