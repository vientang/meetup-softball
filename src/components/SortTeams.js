import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import TeamTransfer from './TeamTransfer';
import AdminSection from './AdminSection';
import Button from './Button';
import componentStyles from './components.module.css';
import 'antd/dist/antd.css';

const iconStyle = {
    fontSize: 16,
    marginRight: '0.5rem',
};
class SortTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            losers: [],
            meetupId: props.data.meetupId,
            players: props.data.players || [],
            teamsBalanced: false,
            winners: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data.meetupId === prevState.meetupId) {
            return null;
        }
        return {
            meetupId: nextProps.data.meetupId,
            players: nextProps.data.players,
        };
    }

    /**
     * @param {Array} winners - items on the left transfer box
     * @param {Array} losers - items on the right transfer box
     */
    handleChange = (winners, losers) => {
        const teamsBalanced = areTeamsBalanced(winners, losers);
        this.setState(() => ({ winners, losers, teamsBalanced }));
    };

    submitList = () => {
        const { losers, winners, teamsBalanced } = this.state;

        if (teamsBalanced) {
            this.props.setTeams(winners, losers);
        }
    };

    render() {
        const { losers, meetupId, players, teamsBalanced, winners } = this.state;
        const buttonProps = {
            disabled: !teamsBalanced,
            onClick: this.submitList,
            tooltipMsg: `Teams are not balanced. You have ${
                winners.length
            } on the winning team and ${
                losers.length
            } on the losing team. Rebalance the teams and try again.`,
        };

        return (
            <AdminSection title="SORT TEAMS" iconType="swap" iconColor="#1890ff">
                <TeamTransfer gameId={meetupId} onChange={this.handleChange} players={players} />
                <Button {...buttonProps}>SET TEAMS</Button>
            </AdminSection>
        );
    }
}

function areTeamsBalanced(winners, losers) {
    if (winners.length === 0 && losers.length === 0) {
        return false;
    }
    return Math.abs(winners.length - losers.length) <= 1;
}

SortTeams.propTypes = {
    data: PropTypes.shape({
        meetupId: PropTypes.string,
        field: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        players: PropTypes.array,
    }),
    setTeams: PropTypes.func,
};

SortTeams.defaultProps = {
    data: {},
};

export default SortTeams;
