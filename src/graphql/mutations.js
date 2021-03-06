/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGameStats = `mutation CreateGameStats($input: CreateGameStatsInput!) {
  createGameStats(input: $input) {
    id
    name
    meetupId
    gameId
    date
    year
    month
    field
    tournamentName
    lat
    lon
    time
    timeStamp
    rsvps
    waitListCount
    winners
    losers
    playerOfTheGame
  }
}
`;
export const updateGameStats = `mutation UpdateGameStats($input: UpdateGameStatsInput!) {
  updateGameStats(input: $input) {
    id
    name
    meetupId
    gameId
    date
    year
    month
    field
    tournamentName
    lat
    lon
    time
    timeStamp
    rsvps
    waitListCount
    winners
    losers
    playerOfTheGame
  }
}
`;
export const deleteGameStats = `mutation DeleteGameStats($input: DeleteGameStatsInput!) {
  deleteGameStats(input: $input) {
    id
    name
    meetupId
    gameId
    date
    year
    month
    field
    tournamentName
    lat
    lon
    time
    timeStamp
    rsvps
    waitListCount
    winners
    losers
    playerOfTheGame
  }
}
`;
export const createPlayerStats = `mutation CreatePlayerStats($input: CreatePlayerStatsInput!) {
  createPlayerStats(input: $input) {
    id
    name
    games
  }
}
`;
export const updatePlayerStats = `mutation UpdatePlayerStats($input: UpdatePlayerStatsInput!) {
  updatePlayerStats(input: $input) {
    id
    name
    games
  }
}
`;
export const deletePlayerStats = `mutation DeletePlayerStats($input: DeletePlayerStatsInput!) {
  deletePlayerStats(input: $input) {
    id
    name
    games
  }
}
`;
export const createPlayers = `mutation CreatePlayers($input: CreatePlayersInput!) {
  createPlayers(input: $input) {
    id
    name
    joined
    profile
    admin
    photos
    status
    gender
  }
}
`;
export const updatePlayers = `mutation UpdatePlayers($input: UpdatePlayersInput!) {
  updatePlayers(input: $input) {
    id
    name
    joined
    profile
    admin
    photos
    status
    gender
  }
}
`;
export const deletePlayers = `mutation DeletePlayers($input: DeletePlayersInput!) {
  deletePlayers(input: $input) {
    id
    name
    joined
    profile
    admin
    photos
    status
    gender
  }
}
`;
export const createSummarizedStats = `mutation CreateSummarizedStats($input: CreateSummarizedStatsInput!) {
  createSummarizedStats(input: $input) {
    id
    stats
  }
}
`;
export const updateSummarizedStats = `mutation UpdateSummarizedStats($input: UpdateSummarizedStatsInput!) {
  updateSummarizedStats(input: $input) {
    id
    stats
  }
}
`;
export const deleteSummarizedStats = `mutation DeleteSummarizedStats($input: DeleteSummarizedStatsInput!) {
  deleteSummarizedStats(input: $input) {
    id
    stats
  }
}
`;
export const createMetaData = `mutation CreateMetaData($input: CreateMetaDataInput!) {
  createMetaData(input: $input) {
    id
    allFields
    allYears
    totalGamesPlayed
    totalPlayersCount
    recentGames
    recentGamesLength
    perYear
    activePlayers
    inactivePlayers
  }
}
`;
export const updateMetaData = `mutation UpdateMetaData($input: UpdateMetaDataInput!) {
  updateMetaData(input: $input) {
    id
    allFields
    allYears
    totalGamesPlayed
    totalPlayersCount
    recentGames
    recentGamesLength
    perYear
    activePlayers
    inactivePlayers
  }
}
`;
export const deleteMetaData = `mutation DeleteMetaData($input: DeleteMetaDataInput!) {
  deleteMetaData(input: $input) {
    id
    allFields
    allYears
    totalGamesPlayed
    totalPlayersCount
    recentGames
    recentGamesLength
    perYear
    activePlayers
    inactivePlayers
  }
}
`;
