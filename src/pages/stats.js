import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listGameStatss } from '../graphql/queries';
import withFilterBar from '../components/withFilterBar';
import NotFoundImage from '../components/NotFoundImage';
import StatsTable from '../components/StatsTable';
import { Utils, apiService } from '../utils';

const categories = [
    'player',
    'gp',
    'ab',
    'h',
    'singles',
    'doubles',
    'triples',
    'r',
    'rbi',
    'hr',
    'avg',
    'sb',
    'cs',
    'bb',
    'k',
    'rc',
    'tb',
];

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerStats: [],
            noDataFound: true,
        };
    }

    async componentDidMount() {
        // GraphQL filter that could replace client side filter in the response below
        // const twenty19 = await API.graphql(
        //     graphqlOperation(listGameStatss, {
        //         filter: {
        //             year: {
        //                 eq: '2019',
        //             },
        //         },
        //     }),
        // );
        // console.log('2019', twenty19);
        // await API.graphql(graphqlOperation(listGameStatss))
        //     .then((response) => {
        //         let playerStats = [];
        //         response.data.listGameStatss.items
        //             .filter((game) => game.year === '2019')
        //             .forEach((game) => {
        //                 const updatedStats = apiService.filterPlayerStats(game, playerStats);
        //                 playerStats = Array.from(updatedStats.values());
        //             });
        //         this.setState(() => ({ playerStats, noDataFound: playerStats.length < 1 }));
        //         apiService.clearMasterList();
        //     })
        //     .catch((error) => {
        //         throw new Error(error);
        //     });
    }

    render() {
        const { playerStats, noDataFound } = this.state;
        const style = { height: '800px' };

        if (noDataFound) {
            return <NotFoundImage />;
        }

        return (
            <StatsTable
                categories={categories}
                players={playerStats}
                sortMethod={Utils.sortHighToLow}
                style={style}
            />
        );
    }
}

export default withFilterBar(Stats);
