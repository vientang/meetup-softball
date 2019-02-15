import React from 'react';
import LeaderCard from '../components/LeaderCard';

const players = [
    {
        name: 'Mike Fresh Basta',
        value: 9,
    },
    {
        name: 'Vien',
        value: 10,
    },
    {
        name: 'Steven',
        value: 3,
    },
    {
        name: 'Max',
        value: 6,
    },
    {
        name: 'John',
        value: 1,
    },
];
const statTitle = 'HOME RUNS';
class LeaderBoard extends React.Component {
    render() {
        return <LeaderCard players={players} stat={statTitle} />;
    }
}

export default LeaderBoard;
