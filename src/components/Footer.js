import React from 'react';
import PropTypes from 'prop-types';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import componentStyles from './components.module.css';

const imageStyle = {
    position: 'absolute',
};

const Footer = (props) => {
    const { data, uri, siteTitle } = props;
    const footerStyle = {
        display: uri === '/' ? 'none' : 'block',
        borderTop: uri === '/' ? 'none' : '1px solid #d1d1d1',
    };

    return (
        <footer style={footerStyle}>
            <Img
                fluid={data.file.childImageSharp.fluid}
                style={imageStyle}
                className={componentStyles.footerImage}
            />
            <div className={componentStyles.footer}>
                <div className={componentStyles.footerCol}>
                    <Link to="/stats" className={componentStyles.footerLink}>
                        STATS
                    </Link>
                    <Link to="/leaderboard" className={componentStyles.footerLink}>
                        LEADERBOARD
                    </Link>
                </div>
                <div>{siteTitle}</div>
                <div className={componentStyles.footerCol}>
                    <Link to="/aboutus" className={componentStyles.footerLink}>
                        ABOUT US
                    </Link>
                    <a
                        href="https://www.meetup.com/San-Francisco-Softball-Players/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={componentStyles.footerLink}
                    >
                        Join us
                    </a>
                </div>
            </div>
        </footer>
    );
};

Footer.displayName = 'Footer';
Footer.propTypes = {
    data: PropTypes.shape({
        file: PropTypes.shape(),
    }),
    siteTitle: PropTypes.string,
    uri: PropTypes.string,
};

export default (props) => (
    <StaticQuery
        query={graphql`
            query {
                file(relativePath: { eq: "footer-image.jpg" }) {
                    childImageSharp {
                        fluid {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
            }
        `}
        render={(data) => <Footer data={data} {...props} />}
    />
);