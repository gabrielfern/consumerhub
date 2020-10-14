import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import { getAll } from '../../services/api'

export default (props) => {
  const [type, setType] = useState('all')
  const [cachedUsers, setCachedUsers] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (props.user) {
      getAll().then(users => {
        setCachedUsers(users)
      })
    }
  }, [props.user])

  useEffect(() => {
    setUsers(cachedUsers.filter(user => {
      if (type !== 'all') {
        if (user.type === type) {
          return true
        } else {
          return false
        }
      }
      return true
    }))
  }, [cachedUsers, type])

  return (
    <>
      <Form.Group className='d-flex align-items-center'>
        <div className='m-2'>
          Tipo de Usuário
        </div>
        <div className='flex-fill'>
          <Form.Control
            as='select' custom value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value='all'>Todos</option>
            <option value='user'>Usuário</option>
            <option value='mod'>Moderador</option>
            <option value='admin'>Administrador</option>
          </Form.Control>
        </div>
      </Form.Group>
      <p className='text-muted text-right'>
        Número de Usuários: {users.length}
      </p>
      <Table hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Email</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) =>
            <tr key={i}>
              <td>
                <Link to={'/user/' + user.id}>
                  {user.id}
                </Link>
              </td>
              <td>
                <Badge variant='secondary'>{user.type}</Badge>
              </td>
              <td className='word-break'>
                {user.email}
              </td>
              <td className='word-break'>
                {user.name}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}
