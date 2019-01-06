import React from 'react';
import Amplify from 'aws-amplify';

import Layout from '../components/Layout';
import Image from '../components/Image';
import configuration from '../aws-exports';

const appSyncConfig = {
    "aws_appsync_graphqlEndpoint": "https://uczx5jb4rrcm5ec4ng7p4zhjiq.appsync-api.us-east-1.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-1",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
    "aws_appsync_apiKey": "null",
};

Amplify.configure({ ...configuration, ...appSyncConfig });

const layoutStyle = {
    margin: '0 auto',
    maxWidth: 1170,
    padding: '0px 1.0875rem 1.45rem',
};

const imageStyle = { 
    width: 100, 
    maxWidth: 300, 
    marginBottom: '1.45rem' 
};

const IndexPage = () => (
    <Layout style={layoutStyle}>
        <h1>Hi aliens</h1>
        <p>Welcome to your new Gatsby site.</p>
        <p>Now go build something great.</p>
        <div style={imageStyle}>
            <Image />
        </div>
    </Layout>
)

export default IndexPage
