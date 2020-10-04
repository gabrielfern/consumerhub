import React from 'react'
import { Link } from 'react-router-dom'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default (props) => {
  return (
    <>
      <Jumbotron>
        <h1>
          Bem vindo ao ConsumerHub!
        </h1>
        <p>
          Explore por produtos que você esteja interessado ou colabore com novos produtos ou avaliações
        </p>
        <Link to='/products'>Veja todos os produtos</Link>
      </Jumbotron>
      <hr />
      <Row className='justify-content-center'>
        <Col lg={4} md={6}>
          <h3>Veja o que os outros dizem sobre um produto</h3>
          <p className='text-muted'>
            Quando estiver curioso sobre a qualidade ou durabilidade de um produto
            você pode sempre ver o que os outros estão dizendo sobre ele, quem sabe
            outras pessoas não mencionam o ponto em que você esta curioso?
          </p>
        </Col>
        <Col lg={4} md={6}>
          <h3>Veja o que os outros dizem sobre um produto</h3>
          <p className='text-muted'>
            Quando estiver curioso sobre a qualidade ou durabilidade de um produto
            você pode sempre ver o que os outros estão dizendo sobre ele, quem sabe
            outras pessoas não mencionam o ponto em que você esta curioso?
          </p>
        </Col>
        <Col lg={4} md={6}>
          <h3>Veja o que os outros dizem sobre um produto</h3>
          <p className='text-muted'>
            Quando estiver curioso sobre a qualidade ou durabilidade de um produto
            você pode sempre ver o que os outros estão dizendo sobre ele, quem sabe
            outras pessoas não mencionam o ponto em que você esta curioso?
          </p>
        </Col>
      </Row>
    </>
  )
}
