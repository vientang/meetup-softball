import React from 'react'
import { Link } from 'gatsby'

const Header = () => ({ siteTitle }) => (
  <div
    style={{
      background: 'rebeccapurple',
      marginBottom: '1.45rem',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: 1500,
        minWidth: 1170,
        width: 1170,
        margin: '0px 6.0875rem',
        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <Link
        to="/admin"
        style={{
          color: 'white',
          textDecoration: 'none',
        }}
      >
        Sign in
      </Link>
    </div>
  </div>
);

export default Header();
