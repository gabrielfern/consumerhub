import React, { useEffect, useState, useCallback } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { getCategories, createCategory, deleteCategory } from '../../services/api'
import { ReactComponent as DeleteSVG } from '../../assets/delete.svg'
import { ReactComponent as PlusSVG } from '../../assets/plus.svg'

export default (props) => {
  const [name, setName] = useState('')
  const [categories, setCategories] = useState([])

  const loadCategories = useCallback(() => {
    if (props.user && props.user.type !== 'user') {
      getCategories().then(categories => {
        setCategories(categories)
      })
    }
  }, [props.user])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  async function add (e) {
    e.preventDefault()
    await createCategory(name)
    setName('')
    loadCategories()
  }

  async function remove (name) {
    await deleteCategory(name)
    loadCategories()
  }

  return (
    <>
      <Form onSubmit={add} className='my-3'>
        <div className='d-flex'>
          <Form.Control
            value={name} placeholder='Crie novas categorias'
            onChange={e => setName(e.target.value)}
          />
          <Button type='submit' className='ml-2'>
            <PlusSVG className='wh-1-em' />
          </Button>
        </div>
      </Form>

      <Table hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((categ, i) =>
            <tr key={i}>
              <td>
                {categ.name}
              </td>
              <td>
                <Button
                  className='d-inline-block p-2 m-1 border-0'
                  variant='outline-danger'
                  onClick={() => remove(categ.name)}
                >
                  <DeleteSVG />
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}
