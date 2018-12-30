import React from 'react'
import { API, graphqlOperation } from 'aws-amplify';
import { listGameStats } from '../graphql/queries';
import Layout from '../components/Layout';
import StatsTable from '../components/StatsTable';
import { statsCalc } from "../utils";
import styles from './pages.module.css';
const categories = ['player', 'gp', 'h', '1b', '2b', '3b', 'r', 'rbi', 'hr', 'avg', 'sb', 'cs', 'bb', 'k', 'rc', 'tb', 'ab'];
class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerStats: [],
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
            
            this.setState(() => ({ playerStats }));
            statsCalc.clearMasterList();
        }).catch(error => {
            console.log('error', error);
            throw new Error(error);
        });
    }

    render() {
        const { playerStats } = this.state;
        const style = { height: '800px' };

        return (
            <>
                <Layout className={styles.adminPage}>
                    <StatsTable 
                        categories={categories}
                        players={playerStats} 
                        style={style} 
                    />
                </Layout>
            </>
        );
    }
}

export default Stats;
