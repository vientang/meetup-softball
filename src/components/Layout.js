import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import Header from './Header';
import Footer from './Footer';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar';
import componentStyles from './components.module.css';

const loadingText = 'Loading ...';

const Layout = ({ className, children, filterBarOptions, loading, style, uri }) => (
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
            return (
                <>
                    <Helmet
                        title={data.site.siteMetadata.title}
                        meta={[
                            {
                                name: 'description',
                                content: 'San Francisco Meetup Softball website',
                            },
                            {
                                name: 'keywords',
                                content: 'meetup, softball, meetupsoftball, meetup-softball',
                            },
                        ]}
                    >
                        <html lang="en" />
                    </Helmet>
                    <Header siteTitle={data.site.siteMetadata.title} uri={uri} />
                    <div className={`${componentStyles.filterRow} ${className}`}>
                        <FilterBar {...filterBarOptions} />
                        <SearchBar disabled={filterBarOptions.disabled} />
                    </div>
                    <main className={componentStyles.pageLayout} style={style}>
                        {loading ? loadingText : children}
                    </main>
                    <Footer siteTitle={data.site.siteMetadata.title} uri={uri} />
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
    filterBar: PropTypes.node,
    loading: PropTypes.bool,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    uri: PropTypes.string,
};

export default Layout;
