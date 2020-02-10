import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Icon } from 'antd';
import styles from './dashboard.module.css';

const { Panel } = Collapse;
const heading = 'MORE GAMES';
const closeIconStyle = { position: 'absolute', right: 0, fontWeight: 'bold', fontSize: 12 };

const MoreGames = ({ games, onGameCancel, onGameSelection, selectedGame }) => {
    const moreGames = games.filter((game) => game.id !== selectedGame);
    const handleCancelGame = (e) => {
        onGameCancel(e, selectedGame);
    };
    return (
        <Collapse defaultActiveKey={['1']}>
            <Panel header={heading} key="1" className={styles.moreGames}>
                {moreGames.map((game) => {
                    return (
                        <div key={game.id} className={styles.gameMenuSection}>
                            <span
                                id={game.id}
                                className={styles.gameMenuName}
                                onClick={onGameSelection}
                            >
                                {game.name}
                            </span>
                            <Icon
                                type="close-circle"
                                theme="filled"
                                style={closeIconStyle}
                                onClick={handleCancelGame}
                            />
                        </div>
                    );
                })}
            </Panel>
        </Collapse>
    );
};

MoreGames.propTypes = {
    games: PropTypes.arrayOf(PropTypes.object),
    onGameCancel: PropTypes.func,
    onGameSelection: PropTypes.func,
    selectedGame: PropTypes.string,
};

MoreGames.defaultProps = {
    games: [],
};

export default MoreGames;
