import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from 'gatsby';
import { Icon, Input, AutoComplete } from 'antd';
import componentStyles from './components.module.css';

const { Option, OptGroup } = AutoComplete;

const SearchBar = ({ disabled, players }) => {
    const [value, setValue] = useState('');
    const [filteredSearchList, setFilteredSearchList] = useState(null);

    const handleSearch = (value) => {
        setFilteredSearchList(filterOptions(players, value));
    };

    const handleSelect = (value, instance) => {
        navigate(`/player?/id=${instance.key}`);
        setValue(instance.props.name);
    };

    const handleChange = (value) => {
        setValue(value);
    };

    const dropdownStyle = { width: 200, fontSize: 12 };
    const autoCompleteStyle = { width: 150, fontSize: 12 };

    const searchList = filteredSearchList || renderOptions(players);

    return (
        <div className={componentStyles.searchBarContainer}>
            <AutoComplete
                dataSource={searchList}
                disabled={disabled}
                dropdownMatchSelectWidth={false}
                dropdownStyle={dropdownStyle}
                onChange={handleChange}
                onSelect={handleSelect}
                onSearch={handleSearch}
                optionLabelProp="name"
                placeholder="Search for player"
                size="small"
                style={autoCompleteStyle}
                value={value}
            >
                <Input suffix={<Icon type="search" />} />
            </AutoComplete>
        </div>
    );
};

function filterOptions(players, value) {
    // TODO: implement smarter search when multiple players are found
    // i.e. maybe sort by highest games played (need to add totalGamesPlayed to PlayersInfo)
    // or last updated timestamp

    return ['RECENT PLAYERS']
        .map((group) => {
            return (
                <OptGroup key={group} label={group}>
                    {players
                        .filter((player) => {
                            return player.name
                                ? player.name.toLowerCase().includes(value.toLowerCase())
                                : false;
                        })
                        .map((player) => {
                            const { id, name } = player;
                            return (
                                <Option key={id} value={`${name}-${id}`} name={name} id={id}>
                                    <Link to={`/player?id=${id}`}>{name}</Link>
                                </Option>
                            );
                        })}
                </OptGroup>
            );
        })
        .concat([
            <Option disabled key="all" className="show-all">
                <a
                    href="https://www.google.com/search?q=antd"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View all results
                </a>
            </Option>,
        ]);
}

function renderOptions(players) {
    return ['RECENT PLAYERS']
        .map((group) => {
            return (
                <OptGroup key={group} label={group}>
                    {players.map((player) => {
                        const { id, name } = player;
                        return (
                            <Option key={id} value={`${name}-${id}`} name={name} id={id}>
                                <Link to={`/player?id=${id}`}>{name}</Link>
                            </Option>
                        );
                    })}
                </OptGroup>
            );
        })
        .concat([
            <Option disabled key="all" className="show-all">
                <a
                    href="https://www.google.com/search?q=antd"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View all results
                </a>
            </Option>,
        ]);
}

/**
 * Change the background of the page when in search mode
 * @param {Boolean} searchMode
 */
function changeListTheme(searchMode) {
    if (searchMode) {
        document.body.style.setProperty('--transfer-list-background', 'rgba(0, 0, 0, 0.5)');
    } else {
        document.body.style.setProperty('--transfer-list-background', '#ffffff');
    }
}

SearchBar.displayName = 'SearchBar';
/* eslint-disable react/no-unused-prop-types */
SearchBar.propTypes = {
    disabled: PropTypes.bool,
    players: PropTypes.arrayOf(PropTypes.shape),
};

SearchBar.defaultProps = {
    disabled: false,
    players: [],
};

export default SearchBar;
