import React from 'react'
import { API, graphqlOperation } from 'aws-amplify';
import { listGameStats } from '../graphql/queries';
import Layout from '../components/Layout';
import StatsTable from '../components/StatsTable';
import { Utils, statsCalc } from "../utils";
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

        return (
            <>
                <Layout className={styles.adminPage}>
                    <StatsTable players={playerStats} />
                </Layout>
            </>
        );
    }
}

export default Stats;
