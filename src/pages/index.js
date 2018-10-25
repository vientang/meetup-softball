import React from 'react'
import { Link } from 'gatsby'
import Amplify from 'aws-amplify'
import Layout from '../components/layout'
import Image from '../components/image'
import configuration from '../aws-exports'

Amplify.configure(configuration);

const IndexPage = () => (
  <Layout>
    <h1>Hi aliens</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: '300px', marginBottom: '1.45rem' }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
