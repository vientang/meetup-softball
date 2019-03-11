import React from 'react';
import withFilterBar from '../components/withFilterBar';
import LeaderCard from '../components/LeaderCard';
import componentStyles from '../components/components.module.css';
import mockData from '../utils/mockData';
import { cardTitles } from '../utils/constants';
import { Utils } from '../utils';

const { mockLeaderBoard } = mockData;

const rateStats = ['Average', 'Winning Percentage', 'OPS', 'wOBA'];

class LeaderBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { players: [] };
    }
    // add function to handle ties for LeaderCard to render
    // will only render 5 items

    componentDidMount() {
        // console.log(this.props.gameData);
        const stats = cardTitles.map((cardTitle) => {
            return Utils.setTopLeaders(mockLeaderBoard, cardTitle.abbr);
        });
        this.setState(() => {
            return {
                players: stats,
            };
        });
    }

    render() {
        const { players } = this.state;
        return (
            <div className={componentStyles.leaderBoard}>
                {cardTitles.map((card) => {
                    return (
                        <LeaderCard
                            players={players}
                            title={card}
                            rate={rateStats.includes(card)}
                        />
                    );
                })}
            </div>
        );
    }
}

export default withFilterBar(LeaderBoard);
