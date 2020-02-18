// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
    siteMetadata: {
        title: 'Meetup Softball',
    },
    plugins: [
        'gatsby-plugin-react-helmet',
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: 'gatsby-starter-default',
                short_name: 'starter',
                start_url: '/',
                theme_color: '#663399',
                display: 'minimal-ui',
                icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
            },
        },
        'gatsby-plugin-offline',
        {
            resolve: 'gatsby-source-graphql',
            options: {
                // This type will contain the remote schema Query type
                typeName: 'SoftballStats',
                // This is the field under which it's accessible
                fieldName: 'softballstats',
                // URL to query from
                url: `${process.env.APPSYNC_API_URL}`,
                headers: {
                    'x-api-key': `${process.env.APPSYNC_API_KEY}`,
                },
            },
        },
    ],
};
