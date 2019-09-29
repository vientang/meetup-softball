import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from 'gatsby';
import { Icon, Input, AutoComplete } from 'antd';
import { fetchAllPlayers, clearAllPlayers } from '../utils/apiService';
import componentStyles from './components.module.css';

const { Option } = AutoComplete;

const SearchBar = ({ disabled }) => {
    const [players, setPlayers] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [value, setValue] = useState('');

    useEffect(() => {
        let mounted = true;
        if (!disabled && !searchList.length && !players.length) {
            const getAllPlayers = async () => {
                const allPlayers = await fetchAllPlayers({ limit: 500 });
                if (allPlayers && allPlayers.length > 0 && mounted) {
                    const playersAsOptions = renderOptions(allPlayers);
                    setPlayers(playersAsOptions);
                    setSearchList(playersAsOptions);
                }
            };
            getAllPlayers();
        }
        clearAllPlayers();

        return () => {
            if (mounted) {
                mounted = false;
            }
        };
    }, [disabled, searchList, players]);

    const handleSearch = (value) => {
        setSearchList(filterOptions(players, value));
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
    return players
        .filter((player) => {
            return player.props.name
                ? player.props.name.toLowerCase().includes(value.toLowerCase())
                : false;
        })
        .map((player) => {
            const { id, name } = player.props;
            return (
                <Option key={id} value={`${name}-${id}`} name={name} id={id}>
                    <Link to={`/player?id=${id}`}>{name}</Link>
                </Option>
            );
        });
}

function renderOptions(players) {
    return players.map((player) => {
        const { id, name } = player;
        return (
            <Option key={id} value={`${name}-${id}`} name={name} id={id}>
                <Link to={`/player?id=${id}`}>{name}</Link>
            </Option>
        );
    });
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
};

SearchBar.defaultProps = {
    disabled: false,
};

export default SearchBar;
