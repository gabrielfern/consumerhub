import React from 'react'
import { ReactComponent as ErrorSVG } from '../../assets/error_outline.svg'

export default () => {
  return (
    <div className='flex-fill d-flex flex-column justify-content-center'>
      <p className='text-center text-muted'>
        <ErrorSVG />
      </p>
      <p className='text-center text-muted'>
        Não há nada aqui
      </p>
    </div>
  )
}
