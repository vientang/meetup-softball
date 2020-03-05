<p align="center">
  <a href="https://www.meetup.com/San-Francisco-Softball-Players/">
    San Francisco Softball Meetup
  </a>
</p>
<h1 align="center">
  Meetup Softball Site
</h1>

# Contributing

Changes to the site should:

-   fix bugs for existing functions or features
-   enhance the API or implementation of an existing function or feature
-   be tested (we use [`jest`](https://www.npmjs.com/package/jest))

## Set up instructions

First of all, you'll need the following installed on your machine.

-   [Node.js](https://nodejs.org/)
-   [Git](https://www.gatsbyjs.org/tutorial/part-zero/#install-git)
-   [Gatsby CLI](https://www.gatsbyjs.org/tutorial/part-zero/#install-the-gatsby-cli): `npm install -g gatsby-cli`
-   [AWS Amplify CLI](https://aws-amplify.github.io/docs/): `npm install -g @aws-amplify/cli`

**Set up AWS Amplify backend configurations (just once).**

You'll need some AWS configurations in order for Amplify to work in your project. You'll also need a `env.development` file which holds keys to the AWS AppSync API and the Meetup.com API. These files are ignored in the check-in process so connect with me about it.

1. [Clone the repo](https://github.com/vientang/meetup-softball.git)
2. Add the `env.development` file and the keys to the root of the project.
3. Run `npm install`
4. Run `npm run setup`. This builds the project and runs all of the unit tests.
5. Run `npm run start`

## Submit your changes

These steps are for checking in client side code. When you're ready to submit your changes, create a custom branch and follow the normal git workflow.

1. `git add .`
2. `git commit` or `git commit -m "...your commit message"`
3. Push your changes to your custom branch with `git push origin <YOUR_BRANCH_NAME>`
4. Create a pull request on GitHub

If you'd like to make changes to any of the back end AWS Amplify services, follow this [guide](https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html)

## References

These resources can help in learning more about the infrastructure tools, services, resources and libraries used in this project.

-   [React](https://reactjs.org/)
-   [Gatsby](https://www.gatsbyjs.org/)
-   [AWS Amplify](https://aws-amplify.github.io/docs/js/start?platform=purejs)
-   [Ant Design](https://ant.design/)
-   [Jest](https://jestjs.io/)

## Issues with getting started

`Error: RootQueryType.allSitePage field type must be Output Type but got: SitePageConnection.`

If you get this error message after cloning the repo, installing dependencies and starting the
project, there are likely multiple versions of `graphql` in the dependency tree.

[Issue #42](https://github.com/gatsbyjs/gatsby-starter-blog/issues/42)

The following steps might resolve the issue. Starting at the root level:

1. Run `rm -rf public` and `rm -rf node_modules`
2. Run `rm -r .cache`
3. Run `rm yarn.lock` and `rm package-lock.json`
4. Run `yarn install` or `npm install` to reinstall dependencies and generate new lock files.
5. Run `yarn start` or `npm start`
