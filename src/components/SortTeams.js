import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, notification } from 'antd';
import TeamTransfer from './TeamTransfer';
import componentStyles from './components.module.css';
import 'antd/dist/antd.css';

const setTeamsBtnStyle = {
    alignSelf: 'flex-end',
    fontSize: 'calc(0.4rem + 0.4vmin)',
};

const iconStyle = {
    fontSize: 16,
    marginRight: '0.5rem',
};
class SortTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meetupId: props.data.meetupId,
            players: props.data.players || [],
            losers: [],
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
        this.setState(() => ({ winners, losers }));
    };

    submitList = () => {
        const { losers, winners } = this.state;
        const teamsBalanced = Math.abs(winners.length - losers.length) <= 1;
        if (teamsBalanced) {
            this.props.setTeams(winners, losers);
        } else {
            notification.warn({
                message: 'Teams are not balanced',
                description: `You have ${winners.length} on the winning team and ${
                    losers.length
                } on the losing team. Rebalance the teams and try again.`,
                duration: 3,
                icon: <Icon type="warning" theme="filled" />,
                style: { color: 'red' },
            });
        }
    };

    render() {
        const { meetupId, players } = this.state;

        return (
            <div className={componentStyles.adminSection}>
                <p className={componentStyles.adminSectionTitle}>
                    <Icon type="build" theme="twoTone" style={iconStyle} />
                    SORT TEAMS
                </p>

                <TeamTransfer gameId={meetupId} onChange={this.handleChange} players={players} />
                <Button
                    type="primary"
                    onClick={this.submitList}
                    style={setTeamsBtnStyle}
                    size="small"
                >
                    SET TEAMS
                </Button>
            </div>
        );
    }
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
