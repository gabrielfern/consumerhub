import React, { useState } from 'react'

export default (props) => {
  const [hadError, setHadError] = useState(false)

  return (
    <div className={'user-image-container ' + (props.className || '')}>
      {(!hadError &&
        <img
          className='rounded'
          src={`/api/users/${props.userId}/image?${props.version}`}
          alt='imagem de usuário'
          onError={() => setHadError(true)}
        />) || <div className='user-image-replacement rounded' />}
    </div>
  )
}
