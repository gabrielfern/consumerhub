import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'

export default (props) => {
  const [fileLabel, setFileLabel] = useState('')

  function checkMaxSize (file) {
    if (props.maxSize && file.size > props.maxSize) {
      window.alert('Tamanho máximo de ' + props.maxSize / 1e6 + ' MB')
      return false
    }
    return true
  }

  return (
    <Form.File
      custom
      label={fileLabel}
      data-browse='Selecionar'
      accept={props.imageOnly ? 'image/png,image/jpeg' : ''}
      onChange={e => {
        if (e.target.files[0] && checkMaxSize(e.target.files[0])) {
          setFileLabel(e.target.files[0].name)
          props.setFile(e.target.files[0])
        } else {
          setFileLabel('')
          props.setFile()
        }
      }}
    />
  )
}
