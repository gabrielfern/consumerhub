import React, { useState, useEffect } from 'react'

export default (props) => {
  const [hadError, setHadError] = useState(false)
  const rounded = props.rounded ? 'rounded' : ''

  useEffect(() => {
    setHadError(false)
  }, [props.src])

  return (
    <div
      className='image-container align-self-center'
      style={{ width: props.width, height: props.height || props.width }}
    >
      {(props.src && !hadError &&
        <img
          className={rounded}
          src={props.src}
          alt={props.alt}
          onError={() => setHadError(true)}
        />) || <div className={'image-replacement ' + rounded} />}
    </div>
  )
}
