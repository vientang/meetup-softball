import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listGameStats } from '../graphql/queries';
import Layout from '../components/Layout';
import NotFoundImage from '../components/NotFoundImage';
import StatsTable from '../components/StatsTable';
import { statsCalc, Utils } from "../utils";
import styles from './pages.module.css';

const categories = ['player', 'gp', 'ab', 'h', '1b', '2b', '3b', 'r', 'rbi', 'hr', 'avg', 'sb', 'cs', 'bb', 'k', 'rc', 'tb'];

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerStats: [],
            noDataFound: false,
        };
    }

    async componentDidMount() {
        await API.graphql(graphqlOperation(listGameStats)).then(response => {
            let playerStats = [];
            
            response.data.listGameStats.items
                .filter(game => game.year === '2018') 
                .forEach((game) => {
                    const updatedStats = statsCalc.filterPlayerStats(game, playerStats);                    
                    playerStats = Array.from(updatedStats.values());
                });
            console.log('stats', playerStats);
            
            this.setState(() => ({ playerStats, noDataFound: playerStats.length < 1 }));
            statsCalc.clearMasterList();
        }).catch(error => {
            console.log('error', error);
            throw new Error(error);
        });
    }

    render() {
        const { playerStats, noDataFound } = this.state;
        const style = { height: '800px' };

        if (noDataFound) {
            return (
                <Layout className={styles.adminPageSuccess}>
                    <NotFoundImage />
                    <h3>There's no data!</h3>
                </Layout>
            );
        }

        return (
            <>
                <Layout className={styles.adminPage}>
                    <StatsTable 
                        categories={categories}
                        players={playerStats} 
                        sortMethod={Utils.sortHighToLow}
                        style={style} 
                    />
                </Layout>
            </>
        );
    }
}

export default Stats;
