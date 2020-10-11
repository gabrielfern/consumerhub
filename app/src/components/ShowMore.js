import React from 'react'
import Button from 'react-bootstrap/Button'

export default (props) => {
  return (
    props.slice < props.length &&
      <div className='my-3 text-center'>
        <Button
          variant='outline-secondary'
          onClick={() =>
            props.setSlice(slice => slice + props.defaultSlice)}
        >
          Mostrar mais
        </Button>
      </div>
  )
}
