<p align="center">
  <a href="https://www.meetup.com/San-Francisco-Softball-Players/">
    San Francisco Softball Meetup
  </a>
</p>
<h1 align="center">
  Meetup Softball Site
</h1>

The current meetup softball site is good but outdated. The goal of this project is to build a new 
site that will be easier for admins to enter stats, introduce versioning so other developers can 
easily contribute, add features that were requested a loooong time ago and redesign the site to 
better organize information like stats, scores, join the group, etc.

## 🚀 Quick start

1.  **Clone the repo.**
    [Meetup Softball](https://github.com/vientang/meetup-softball.git)

2.  **Run the scripts.**
    ```
        # install the dependencies
        npm install

        # install the Gatsby CLI globally
        npm install -g gatsby-cli

        # install the AWSMobile CLI
        npm install -g awsmobile-cli
    ```

4.  **Set up AWS backend configurations (just once).**
    ```
    # set up credentials to interact with AWS.

    I'll need to send you the credentials. Hit me up.
    ```

5.  **Start the server**
    ```
    # start a hot-reloading development environment accessible at `localhost:8000`
    npm start

    Your site is now running at `http://localhost:8000`!

    If a `localhost:8000` server is already running, Gatsby will suggest another port. Just say yes when prompted.
    ```

6.  **Open the source code and start editing!**
    Open `pages/index.js`. This is the starting point. 
      
    *Note: You'll also see a second link: `http://localhost:8000___graphql`. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://next.gatsbyjs.org/tutorial/part-five/#introducing-graphiql).*
    
## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── yarn.lock

  1.  **`/node_modules`**: The directory where all of the modules of code that your project depends on (npm packages) are automatically installed.  
  
  2.  **`/src`**: This directory will contain all of the code related to what you will see on the
   front-end of your site (what you see in the browser), like your site header, or a page 
   template. “Src” is a convention for “source code”. In your **`/pages`** folder, any file you 
   create in here is treated as an individual page on the site. Gatsby creates an endpoint for 
   this page.
  
  3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.
  
  4.  **`.prettierrc`**: This is a configuration file for a tool called [Prettier](https://prettier.io/), which is a tool to help keep the formatting of your code consistent.
  
  5.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://next.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.
  
  6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://next.gatsbyjs.org/docs/gatsby-config/) for more detail).
  
  7.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby node APIs](https://next.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.
  
  8.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://next.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.
  
  9.  **`LICENSE`**: Gatsby is licensed under the MIT license.
  
  10.  **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed. (You won’t change this file directly).
  
  11.  **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install.
  
  12.  **`README.md`**: A text file containing useful reference information about this project.
  
  13.  **`yarn.lock`**: [Yarn](https://yarnpkg.com/) is a package manager alternative to npm. You can use either yarn or npm. This file serves essentially the same purpose as `package-lock.json`, just for a different package management system. (You won’t change this file directly).

## Issues getting started

`Error: RootQueryType.allSitePage field type must be Output Type but got: SitePageConnection.`

If you get this error message after cloning the repo, installing dependencies and starting the 
project, there likely are multiple versions of `graphql` in the dependency tree. 

[Issue #42](https://github.com/gatsbyjs/gatsby-starter-blog/issues/42)

The following steps resolved the issue for me. Starting at the root level:

1. Run `rm -rf public` and `rm -rf node_modules`
2. Run `rm -r .cache`
3. Run `rm yarn.lock` and `rm package-lock.json`
4. Run `yarn install` or `npm install` to reinstall dependencies and generate new lock files.
5. Run `yarn start` or `npm start`
