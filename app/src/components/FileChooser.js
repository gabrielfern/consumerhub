import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'

export default (props) => {
  const [fileLabel, setFileLabel] = useState('')

  return (
    <Form.File
      custom
      label={fileLabel}
      data-browse='Selecionar'
      onChange={e => {
        if (e.target.files[0]) {
          setFileLabel(e.target.files[0].name)
        } else {
          setFileLabel('')
        }
        props.setFile(e.target.files[0])
      }}
    />
  )
}
