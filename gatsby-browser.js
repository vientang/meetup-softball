/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react';
import DataContext from './src/context/DataContext';
import 'react-table/react-table.css';
import 'antd/dist/antd.css';
import './src/styles/index.css';
import './src/styles/overrides.css';

// eslint-disable-next-line react/prop-types
const wrapRootElement = ({ element }) => <DataContext.Provider>{element}</DataContext.Provider>;

export default wrapRootElement;
