// eslint-disable
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
  }
}
`;
export const createPlayerStats = `mutation CreatePlayerStats($input: CreatePlayerStatsInput!) {
  createPlayerStats(input: $input) {
    id
    name
    joined
    meetupId
    profile
    admin
    photos
    status
    gender
    games
  }
}
`;
export const updatePlayerStats = `mutation UpdatePlayerStats($input: UpdatePlayerStatsInput!) {
  updatePlayerStats(input: $input) {
    id
    name
    joined
    meetupId
    profile
    admin
    photos
    status
    gender
    games
  }
}
`;
export const deletePlayerStats = `mutation DeletePlayerStats($input: DeletePlayerStatsInput!) {
  deletePlayerStats(input: $input) {
    id
    name
    joined
    meetupId
    profile
    admin
    photos
    status
    gender
    games
  }
}
`;
