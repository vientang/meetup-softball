import React from 'react';
import PropTypes from 'prop-types';
import API from '@aws-amplify/api';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import get from 'lodash/get';
import { BoxScoreGroup, Layout } from '../components';
import pageStyles from './pages.module.css';
import configuration from '../aws-exports';

API.configure({
    ...configuration,
    aws_project_region: process.env.APPSYNC_REGION,
    aws_appsync_apiKey: process.env.APPSYNC_API_KEY,
    aws_appsync_graphqlEndpoint: process.env.APPSYNC_GRAPHQL_URL,
    aws_appsync_region: process.env.APPSYNC_REGION,
    aws_appsync_authenticationType: process.env.APPSYNC_AUTH_TYPE,
    API: {
        graphql_endpoint: process.env.APPSYNC_GRAPHQL_URL,
        graphql_headers: async () => ({
            'x-api-key': process.env.APPSYNC_API_KEY,
        }),
    },
});

const IndexPage = ({ data, uri }) => {
    const recentGames = JSON.parse(get(data, 'softballstats.metadata.recentGames', []));
    const fluidImage = get(data, 'imageOne.childImageSharp.fluid');
    const imageStyle = { position: 'absolute' };
    return (
        <>
            <Img fluid={fluidImage} style={imageStyle} className={pageStyles.homePageImage} />
            <a
                href="https://unsplash.com/photos/sMV7U5ybJKs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                target="_blank"
                rel="noopener noreferrer"
            >
                <p className={pageStyles.photoCredit}>Photo by Christopher Czermak on Unsplash</p>
            </a>
            <Layout className={pageStyles.homePageLayout} uri={uri}>
                <BoxScoreGroup recentGames={recentGames} />
            </Layout>
        </>
    );
};

IndexPage.displayName = 'IndexPage';
IndexPage.propTypes = {
    data: PropTypes.shape(),
    uri: PropTypes.string,
};

export default IndexPage;

export const fluidImage = graphql`
    fragment fluidImage on File {
        childImageSharp {
            fluid(maxWidth: 1000) {
                ...GatsbyImageSharpFluid
            }
        }
    }
`;

export const pageQuery = graphql`
    query {
        softballstats {
            metadata: getMetaData(id: "_metadata") {
                id
                recentGames
            }
        }
        imageOne: file(relativePath: { eq: "softball.jpg" }) {
            ...fluidImage
        }
    }
`;
