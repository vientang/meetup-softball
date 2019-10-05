import React from 'react';
import Amplify from 'aws-amplify';
import configuration from '../aws-exports';
import { fetchAllPlayers } from '../utils/apiService';

Amplify.configure(configuration);

const getDefaultState = async () => {
    // const players = await fetchAllPlayers({ limit: 500 });
    // return { players };
};

const DataContext = React.createContext(getDefaultState());
// export const useDataContext = () => useContext(DataContext);
export default DataContext;
