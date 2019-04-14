import React from 'react';
import PropTypes from 'prop-types';
import Amplify from 'aws-amplify';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import { BoxScore, Layout, JoinUs } from '../components';
import pageStyles from './pages.module.css';
import configuration from '../aws-exports';

Amplify.configure(configuration);

const layoutStyle = {
    margin: '0 auto',
    maxWidth: 1170,
    padding: '1.45rem 1.0875rem',
};

const imageStyle = {
    position: 'absolute',
};

const IndexPage = (props) => {
    return (
        <>
            <Img
                fluid={props.data.imageOne.childImageSharp.fluid}
                style={imageStyle}
                className={pageStyles.homePageImage}
            />
            <a
                href="https://unsplash.com/photos/sMV7U5ybJKs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                target="_blank"
                rel="noopener noreferrer"
            >
                <p className={pageStyles.photoCredit}>Photo by Christopher Czermak on Unsplash</p>
            </a>
            <Layout style={layoutStyle} uri={props.uri}>
                <div className={pageStyles.boxScoreGroup}>
                    <JoinUs />
                    <BoxScore />
                    <BoxScore />
                </div>
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
        imageOne: file(relativePath: { eq: "softball.jpg" }) {
            ...fluidImage
        }
    }
`;
