import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import NothingHere from '../components/NothingHere'
import { editNotification, deleteNotification } from '../services/api'
import { ReactComponent as MarkReadSVG } from '../assets/mark_read.svg'
import { ReactComponent as MarkUnreadSVG } from '../assets/mark_unread.svg'
import { ReactComponent as DeleteSVG } from '../assets/delete.svg'

export default (props) => {
  const { loadNotifications } = props

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  async function setIsRead (id, isRead) {
    await editNotification(id, isRead)
    loadNotifications()
  }

  async function remove (id) {
    await deleteNotification(id)
    loadNotifications()
  }

  return (
    <>
      <h1>Notificações</h1>
      {(props.notifications.length &&
        <Table hover>
          <thead>
            <tr>
              <th>Mensagem</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {props.notifications.map((notif, i) =>
              <tr key={i}>
                <td className={notif.isRead ? 'strike-through' : ''}>
                  {notif.message}
                  {notif.url &&
                    <div>
                      <Link to={notif.url}>Visitar</Link>
                    </div>}
                </td>
                <td>
                  <Button
                    className='d-inline-block p-2 m-1 border-0'
                    variant='outline-dark'
                    onClick={() => setIsRead(notif.id, !notif.isRead)}
                  >
                    {(notif.isRead && <MarkUnreadSVG />) || <MarkReadSVG />}
                  </Button>
                  <Button
                    className='d-inline-block p-2 m-1 border-0'
                    variant='outline-danger'
                    onClick={() => remove(notif.id)}
                  >
                    <DeleteSVG />
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      ) || <NothingHere />}
    </>
  )
}
