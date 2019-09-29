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

// eslint-disable-next-line react/prop-types
const ActionBar = ({ className, disabled, filterBarOptions, uri }) => {
    if (uri === '/') {
        return null;
    }

    return (
        <div className={`${componentStyles.filterRow} ${className}`}>
            <FilterBar {...filterBarOptions} disabled={disabled} />
            <SearchBar disabled={disabled} />
        </div>
    );
};

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
            const disabled = filterBarOptions ? filterBarOptions.disabled : false;
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
                    <ActionBar
                        disabled={disabled}
                        className={className}
                        filterBarOptions={filterBarOptions}
                        uri={uri}
                    />
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
    loading: PropTypes.bool,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    uri: PropTypes.string,
};

export default Layout;
