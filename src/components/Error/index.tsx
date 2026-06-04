import React from 'react'
import './error.css'

type ErrorProps = {
  errorMessage: string
}

/**
 * This component is used error fetching data, no artist found and 404 page.
 * This component accept the errorMessage as props to render the text.
 */

const Error = (props: ErrorProps) => {
  const { errorMessage } = props
  return (
    <div className='error-main'>
      <div style={{
        padding: '1rem',
        borderRadius: '0.5rem',
        background: 'var(--surfaceVariant)'
      }}>
        <p className='subtitle-two' >{errorMessage}</p>
      </div>
    </div>
  )
}

export default Error
