import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getReports, deleteReport as deleteReportAPI } from '../../services/api'
import { ReactComponent as DeleteSVG } from '../../assets/delete.svg'

export default (props) => {
  const [type, setType] = useState('users')
  const [reports, setReports] = useState([])

  const loadReports = useCallback(() => {
    getReports(type).then(reports => {
      if (reports) {
        setReports(reports)
      }
    })
  }, [type])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  function getReportLink (report) {
    if (report.reportedId) {
      return '/user/' + report.reportedId
    } else if (report.reviewId) {
      return `/product/${report.Review.productId}#${report.reviewId}`
    } else if (report.productId) {
      return '/product/' + report.productId
    }
  }

  async function deleteReport (report) {
    if (report.reportedId) {
      await deleteReportAPI(type, 'reportedId', report.reportedId, report.userId)
    } else if (report.reviewId) {
      await deleteReportAPI(type, 'reviewId', report.reviewId, report.userId)
    } else if (report.productId) {
      await deleteReportAPI(type, 'productId', report.productId, report.userId)
    }
    loadReports()
  }

  return (
    <>
      <Form.Group className='d-flex align-items-center'>
        <div className='m-2'>
          Tipo de report
        </div>
        <div className='flex-fill'>
          <Form.Control
            as='select' custom value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value='users'>Usuários</option>
            <option value='reviews'>Avaliações</option>
            <option value='products'>Produtos</option>
          </Form.Control>
        </div>
      </Form.Group>
      <Table hover>
        <thead>
          <tr>
            <th>Reportador</th>
            <th>
              {(type === 'users' && 'Reportado') ||
                (type === 'reviews' && 'Avaliação') ||
                (type === 'products' && 'Produto')}
            </th>
            <th>Motivo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, i) =>
            <tr key={i}>
              <td>
                <Link to={'/user/' + report.userId}>
                  <div className='my-3'>{report.userId}</div>
                </Link>
              </td>
              <td>
                <Link to={getReportLink(report)}>
                  <div className='my-3'>
                    {report.reportedId || report.reviewId || report.productId}
                  </div>
                </Link>
              </td>
              <td className='space-break'>
                <div className='my-3'>{report.text}</div>
              </td>
              <td>
                <Button
                  className='d-inline-block p-2 m-1 border-0'
                  variant='outline-danger'
                  onClick={() => deleteReport(report)}
                >
                  <DeleteSVG />
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}
