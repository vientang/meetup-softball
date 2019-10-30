import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import get from 'lodash/get';
import Header from './Header';
import ActionBar from './ActionBar';
import Footer from './Footer';
import componentStyles from './components.module.css';

const loadingText = 'Loading ...';
const metaData = [
    {
        name: 'description',
        content: 'San Francisco Meetup Softball website',
    },
    {
        name: 'keywords',
        content: 'meetup, softball, meetupsoftball, meetup-softball',
    },
];

const Layout = ({
    className,
    children,
    filterBarOptions,
    inactivePlayers,
    loading,
    players,
    style,
    uri,
}) => (
    <StaticQuery
        query={graphql`
            query SiteTitleQuery {
                site {
                    siteMetadata {
                        title
                    }
                }
            }
        `}
        render={(data) => {
            const title = get(data, 'site.siteMetadata.title', 'Meetup Softball');
            const disabled = filterBarOptions ? filterBarOptions.disabled : false;
            return (
                <>
                    <Helmet title={title} meta={metaData}>
                        <html lang="en" />
                    </Helmet>
                    <Header siteTitle={title} uri={uri} />
                    <ActionBar
                        disabled={disabled}
                        filterBarOptions={filterBarOptions}
                        inactivePlayers={inactivePlayers}
                        players={players}
                        uri={uri}
                    />
                    <main className={`${componentStyles.pageLayout} ${className}`} style={style}>
                        {loading ? loadingText : children}
                    </main>
                    <Footer siteTitle={title} uri={uri} />
                </>
            );
        }}
    />
);

Layout.displayName = 'Layout';
Layout.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    filterBarOptions: PropTypes.shape(),
    loading: PropTypes.bool,
    inactivePlayers: PropTypes.arrayOf(PropTypes.shape),
    players: PropTypes.arrayOf(PropTypes.shape),
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    uri: PropTypes.string,
};
Layout.defaultProps = {
    filterBarOptions: {},
    inactivePlayers: [],
    players: [],
};

export default Layout;
