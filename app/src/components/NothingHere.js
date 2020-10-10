import React from 'react'
import { ReactComponent as ErrorSVG } from '../assets/error_outline.svg'

export default (props) => {
  return (
    <div className='flex-fill d-flex flex-column justify-content-center'>
      <p className='text-center text-muted'>
        <ErrorSVG width='96px' height='96px' />
      </p>
      <p className='text-center text-muted'>
        {props.text || 'Não há nada aqui'}
      </p>
    </div>
  )
}
