import React from 'react';
import Layout from '../components/Layout';
import LeaderCard from '../components/LeaderCard';
import componentStyles from '../components/components.module.css';
import styles from './pages.module.css';

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

const cards = [
    'Home Runs',
    'Average',
    'Winning Percentage',
    'Runs Created',
    'Runs Batted In',
    'Runs',
    'Doubles',
    'Triples',
    'Stolen Bases',
    'OPS',
    'wOBA',
];

const rateStats = ['Average', 'Winning Percentage', 'OPS', 'wOBA'];

class LeaderBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Layout className={styles.adminPage}>
                <div className={componentStyles.leaderBoard}>
                    {cards.map((card) => {
                        return (
                            <LeaderCard
                                players={players}
                                title={card}
                                rate={rateStats.includes(card)}
                            />
                        );
                    })}
                </div>
            </Layout>
        );
    }
}

export default LeaderBoard;
