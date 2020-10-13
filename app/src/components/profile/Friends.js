import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { getFriends } from '../../services/api'
import NothingHere from '../NothingHere'
import ShowMore from '../ShowMore'
import { ReactComponent as EmailSVG } from '../../assets/email.svg'

export default (props) => {
  const defaultSlice = 12
  const [friends, setFriends] = useState([])
  const [slice, setSlice] = useState(defaultSlice)

  useEffect(() => {
    if (props.user) {
      getFriends(props.user.id).then(friends => {
        setFriends(friends)
      })
    }
  }, [props.user])

  return (
    (friends.length &&
      <>
        <Row xs={1} xl={2} noGutters>
          {friends.slice(0, slice).map((friend, i) =>
            <Col key={i} className='p-1 d-flex flex-column space-break'>
              <div className='flex-fill d-flex flex-column border rounded p-3'>
                <Link to={`/user/${friend.id}`}>
                  {friend.name}
                </Link>
                <p className='text-muted'><EmailSVG /> {friend.email}</p>
              </div>
            </Col>
          )}
        </Row>
        <ShowMore
          slice={slice} defaultSlice={defaultSlice}
          setSlice={setSlice} length={friends.length}
        />
      </>) || <NothingHere />
  )
}
