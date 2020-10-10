import React, { useEffect, useState, useCallback } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { getCategories, createCategory, editCategory, deleteCategory } from '../../services/api'
import { ReactComponent as DeleteSVG } from '../../assets/delete.svg'
import { ReactComponent as PlusSVG } from '../../assets/plus.svg'
import { ReactComponent as EditSVG } from '../../assets/edit.svg'
import { ReactComponent as CheckSVG } from '../../assets/check.svg'

export default (props) => {
  const [name, setName] = useState('')
  const [categories, setCategories] = useState([])
  const [editingName, setEditingName] = useState('')
  const [editingIndex, setEditingIndex] = useState()

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
    if (name) {
      await createCategory(name)
      loadCategories()
      setName('')
    }
    setEditingIndex()
  }

  async function edit (name) {
    if (name !== editingName && editingName) {
      await editCategory(name, editingName)
      loadCategories()
    }
    setEditingIndex()
  }

  async function remove (name) {
    await deleteCategory(name)
    loadCategories()
    setEditingIndex()
  }

  return (
    <>
      <Form onSubmit={add} className='my-3'>
        <div className='d-flex'>
          <Form.Control
            value={name} placeholder='Nome de nova categoria'
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
                {(editingIndex === i &&
                  <Form.Control
                    className='m-2' autoFocus
                    value={editingName} placeholder='Novo nome para essa categoria'
                    onChange={e => setEditingName(e.target.value)}
                  />) ||
                    <div className='m-2'>{categ.name}</div>}
              </td>
              <td>
                <Button
                  className='d-inline-block p-2 m-1 border-0'
                  variant='outline-dark'
                  onClick={() => {
                    if (editingIndex === i) {
                      edit(categ.name)
                    } else {
                      setEditingName(categ.name)
                      setEditingIndex(i)
                    }
                  }}
                >
                  {(editingIndex === i && <CheckSVG />) ||
                    <EditSVG />}
                </Button>
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
