import React from 'react'
import { API, graphqlOperation } from 'aws-amplify';
import { listGameStats } from '../graphql/queries';
import Layout from '../components/Layout';
import StatsTable from '../components/StatsTable';
import { statsCalc } from "../utils";
import styles from './pages.module.css';
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

            const stats = response.data.listGameStats.items.filter(game => game.year === '2018');            
            stats.forEach((game) => {
                // combine winners and losers of 1 game into 1 list
                const allPlayers = statsCalc.mergeAllCurrentPlayers(game);
                playerStats = playerStats.concat(allPlayers);
            });

            this.setState(() => ({ playerStats }));
        }).catch(error => {
            console.log('error', error);
        });
    }

    render() {
        const { playerStats } = this.state;
        const style = { height: '800px' };
        
        return (
            <>
                <Layout className={styles.adminPage}>
                    <StatsTable players={playerStats} style={style} />
                </Layout>
            </>
        );
    }
}

export default Stats;
