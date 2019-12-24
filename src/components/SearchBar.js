import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from 'gatsby';
import { AutoComplete } from 'antd';
import PlayerAvatar from './PlayerAvatar';
import componentStyles from './components.module.css';

const { Option, OptGroup } = AutoComplete;

const SearchBar = ({ disabled, open, players, showInactiveDrawer }) => {
    const [value, setValue] = useState('');
    const [filteredSearchList, setFilteredSearchList] = useState(null);

    const handleSearch = (value) => {
        setFilteredSearchList(filterOptions(players, value, showInactiveDrawer));
    };

    const handleSelect = (value, instance) => {
        if (instance.key === 'inactive') {
            return;
        }
        navigate(`/player?/id=${instance.key}`);
        setValue(instance.props.name);
    };

    const handleChange = (value) => {
        setValue(value);
    };

    const dropdownStyle = { fontSize: 14, width: 390 };
    const autoCompleteStyle = { width: '100%', fontSize: 12 };

    const searchList = filteredSearchList || renderOptions(players, showInactiveDrawer);

    return (
        <AutoComplete
            autoFocus={open}
            dataSource={searchList}
            disabled={disabled}
            dropdownMatchSelectWidth={false}
            dropdownStyle={dropdownStyle}
            onChange={handleChange}
            onSelect={handleSelect}
            onSearch={handleSearch}
            open={open}
            optionLabelProp="name"
            placeholder="Search for player"
            size="small"
            style={autoCompleteStyle}
            value={value}
        />
    );
};

const playersMap = new Map();
export function filterOptions(players, value, showInactiveDrawer) {
    const char = value && value.length === 1 ? value[0] : null;
    if (char && !playersMap.has(char)) {
        playersMap.set(
            char,
            players.filter((player) =>
                player.name ? player.name.toLowerCase()[0] === char : false,
            ),
        );
    }

    const playerOptions = playersMap.get(value[0]) || players;
    playerOptions.sort((a, b) => (a.gp < b.gp ? 1 : -1));
    return ['RECENT PLAYERS']
        .map((group) => {
            return (
                <OptGroup key={group} label={group}>
                    {playerOptions
                        .filter((player) =>
                            player.name
                                ? player.name.toLowerCase().includes(value.toLowerCase())
                                : false,
                        )
                        .map((player) => {
                            const { id, name, photos = {} } = player;
                            return (
                                <Option key={id} value={`${name}-${id}`} name={name} id={id}>
                                    <PlayerAvatar
                                        image={photos.thumb_link}
                                        name={name}
                                        style={{
                                            marginRight: '0.5rem',
                                            border: '1px solid #f7b639',
                                        }}
                                    />
                                    <Link to={`/player?id=${id}`}>{name}</Link>
                                </Option>
                            );
                        })}
                </OptGroup>
            );
        })
        .concat([
            <Option key="inactive" className={componentStyles.optionInactive}>
                <span onClick={showInactiveDrawer}>Show inactive players</span>
            </Option>,
        ]);
}

function renderOptions(players, showInactiveDrawer) {
    players.sort((a, b) => (a.gp < b.gp ? 1 : -1));
    return ['RECENT PLAYERS']
        .map((group) => {
            return (
                <OptGroup key={group} label={group}>
                    {players.map((player) => {
                        const { id, name, photos = {} } = player;
                        return (
                            <Option key={id} value={`${name}-${id}`} name={name} id={id}>
                                <PlayerAvatar
                                    image={photos.thumb_link}
                                    name={name}
                                    style={{
                                        marginRight: '0.5rem',
                                        border: '1px solid #f7b639',
                                    }}
                                />
                                <Link to={`/player?id=${id}`}>{name}</Link>
                            </Option>
                        );
                    })}
                </OptGroup>
            );
        })
        .concat([
            <Option key="inactive" className={componentStyles.optionInactive}>
                <span onClick={showInactiveDrawer}>Show inactive players</span>
            </Option>,
        ]);
}

SearchBar.displayName = 'SearchBar';
SearchBar.propTypes = {
    disabled: PropTypes.bool,
    open: PropTypes.bool,
    players: PropTypes.arrayOf(PropTypes.shape),
    showInactiveDrawer: PropTypes.func,
};

SearchBar.defaultProps = {
    disabled: false,
    open: false,
    players: [],
};

export default SearchBar;
