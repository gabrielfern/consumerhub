import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { getProducts, getReviews } from '../services/api'
import NothingHere from '../components/NothingHere'
import Image from '../components/Image'
import Stars from '../components/Stars'
import { productStars } from '../utils/functions'

export default (props) => {
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [mappedReviews, setMappedReviews] = useState({})

  useEffect(() => {
    getProducts().then(products => {
      if (products) {
        setProducts(products.sort((a, b) =>
          new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1
        ))
      }
    })
    getReviews().then(reviews => {
      if (reviews) {
        setReviews(reviews)
      }
    })
  }, [])

  useEffect(() => {
    products.slice(0, 3).forEach(prod => {
      const prodReviews = reviews.filter(r => r.productId === prod.id)
      setMappedReviews(reviews => ({
        ...reviews, [prod.id]: prodReviews
      }))
    })
  }, [products, reviews])

  return (
    <>
      <Jumbotron>
        <h1 className='display-4 text-info d-none d-md-block'>
          Bem vindo ao ConsumerHub!
        </h1>
        <h1 className='text-info d-md-none'>
          Bem vindo ao ConsumerHub!
        </h1>
        <p>
          Explore por produtos que você esteja interessado ou colabore com novos produtos e avaliações
        </p>
        <Link to='/products'>Veja todos os produtos</Link>
      </Jumbotron>
      <hr />
      <Row className='justify-content-center'>
        <Col lg={4} md={6}>
          <h3>Veja o que os outros dizem sobre um produto</h3>
          <p className='text-muted'>
            Quando estiver curioso sobre a qualidade ou durabilidade de um produto,
            você pode sempre ver o que os outros estão dizendo sobre ele, quem sabe
            outras pessoas não mencionam o ponto em que você esta curioso?
          </p>
        </Col>
        <Col lg={4} md={6}>
          <h3>Compartilhe suas experiências</h3>
          <p className='text-muted'>
            Comprou um produto e se decepcionou? Ou teve uma ótima surpresa com
            um produto novo que você não estava esperando? Compartilhe com os outros,
            quem sabe outra pessoa não lhe da uma ótima dica, e você a ela?
          </p>
        </Col>
        <Col lg={4} md={6}>
          <h3>Na dúvida entre qual produto escolher?</h3>
          <p className='text-muted'>
            Explore os produtos da categoria que você esta interessado,
            como por exemplo a de "Celulares", descubra os pontos fortes
            e fracos de cada um e faça a melhor escolha.
          </p>
        </Col>
      </Row>

      <hr />

      <h3>Últimos produtos atualizados</h3>
      {!products.length && <NothingHere text='Nenhum produto cadastrado ainda' />}
      {!!products.length &&
        <div className='d-flex flex-wrap justify-content-around align-items-stretch'>
          {products.slice(0, 3).map((product, i) =>
            <Link className='text-reset text-decoration-none d-flex' key={i} to={`/product/${product.id}`}>
              <Card className='my-3 flex-fill' style={{ width: '322px' }}>
                <Card.Header>
                  <h4>
                    {product.name || 'Produto sem nome'}
                  </h4>
                </Card.Header>
                <Image
                  width='320px'
                  src={`/api/images/${product.image1}`}
                />
                <Card.Body className='flex-fill'>
                  {product.description.trim().slice(0, 200) ||
                    <span className='text-muted'>Produto sem descrição</span>}
                  {product.description.trim().length > 200 &&
                    <span>...</span>}
                </Card.Body>
                <Card.Footer className='d-flex'>
                  <Stars
                    value={
                      productStars(mappedReviews[product.id])
                    }
                  />
                  <span className='flex-fill text-right'>
                    {mappedReviews[product.id] && mappedReviews[product.id].length +
                      (mappedReviews[product.id].length === 1 ? ' avaliação' : ' avaliações')}
                  </span>
                </Card.Footer>
              </Card>
            </Link>
          )}
        </div>}
      <hr />

      <Row xs={1} md={2}>
        <Col className='py-5 text-center'>
          <h4 className=''>
            Número de produtos na plataforma
          </h4>
          <h4 className='text-primary display-4 p-3'>
            {products.length}
          </h4>
        </Col>
        <Col className='py-5 text-center'>
          <h4>
            Número de avaliações na plataforma
          </h4>
          <h4 className='text-primary display-4 p-3'>
            {reviews.length}
          </h4>
        </Col>
      </Row>

    </>
  )
}
