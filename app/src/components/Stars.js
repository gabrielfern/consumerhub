import React from 'react'
import { ReactComponent as StarSVG } from '../assets/star.svg'
import { ReactComponent as StarHalfSVG } from '../assets/star_half.svg'
import { ReactComponent as StarOutlineSVG } from '../assets/star_outline.svg'

export default (props) => {
  const rounded = Math.round(props.value / 0.5) * 0.5
  const fullStars = Math.floor(rounded / 0.5 / 2)
  const halfStars = rounded / 0.5 % 2
  const emptyStars = Math.floor(5 - rounded)

  return (
    <div className='d-inline' title={props.value.toFixed(1) + ' de 5'}>
      {[...Array(fullStars).keys()].map((i) =>
        <StarSVG key={i} />
      )}
      {[...Array(halfStars).keys()].map((i) =>
        <StarHalfSVG key={i} />
      )}
      {[...Array(emptyStars).keys()].map((i) =>
        <StarOutlineSVG key={i} />
      )}
    </div>
  )
}
