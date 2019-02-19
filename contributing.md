<p align="center">
  <a href="https://www.meetup.com/San-Francisco-Softball-Players/">
    San Francisco Softball Meetup
  </a>
</p>
<h1 align="center">
  Meetup Softball Site
</h1>

# Contributing

**Working on your first Pull Request?** You can learn how from this *free* series
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

You **always** want to look at this file *before* contributing. In here you should find
instructions for coding standards and contributing guidelines.

## Acceptable Contributions
**Please discuss any changes in the issues section** before working on a PR to make sure
that I'll accept it before you spend time working on it. I only accept pull requests that:

- fix bugs for existing functions or features
- enhance the API or implementation of an existing function or feature
- adds a function or feature that is tested (see the `test` directory; we use [`jest`](https://www.npmjs.com/package/jest))
- have been linted

## Set up instructions
First of all, you're going to need to have the following installed to contribute to this project.

- [Node.js](https://nodejs.org/)
- [Git](https://www.gatsbyjs.org/tutorial/part-zero/#install-git)
- [Gatsby CLI](https://www.gatsbyjs.org/tutorial/part-zero/#install-the-gatsby-cli): `npm install -g gatsby-cli`
- [AWS Amplify CLI](https://aws-amplify.github.io/docs/): `npm install -g @aws-amplify/cli`


1. Fork the repo
2. Clone your fork
3. Create a branch

**Set up AWS Amplify backend configurations (just once).**
You'll need some configuration for Amplify to work in your project. This file is ignored in the the checkin process so I'll connect with you about it. Hit me up.

### Amplify setup
AWS Amplify has a different setup for [multi-environment](https://aws-amplify.github.io/docs/cli/multienv?sdk=js) development. Contact me if you'd like to work on the backend part of this project.

### Project setup

1. Run `npm install`
2. Run `npm run setup`. If everything works, then you're ready to make changes.
3. Run `npm run test:watch` (optional)
4. Run `npm run start`
5. Make your changes and review them at `localhost:8000`
6. If you get things working, add your changed files with `git add .` and then commit your changes with `git commit`. You'll get an interactive prompt for creating a commit message. Alternatively, you can write your commit message with the `-m ` flag, like so `git commit -m "...some commit message"`
7. Push your changes to your fork with `git push`
8. Create a pull request from your repo
9. Look over the code review and iterate on the solution, if needed
10. Your code is merged! 🎉 🎊