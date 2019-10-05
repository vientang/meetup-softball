import React, { useContext } from 'react';

const DataContext = React.createContext();

export const useDataContext = () => useContext(DataContext);
export default DataContext;
