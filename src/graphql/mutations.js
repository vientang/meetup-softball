// eslint-disable
// this is an auto generated file. This will be overwritten

export const createGameStats = `mutation CreateGameStats($input: CreateGameStatsInput!) {
  createGameStats(input: $input) {
    id
    meetupId
    name
    date
    gameId
    year
    month
    fieldName
    tournamentName
    winners
    losers
  }
}
`;
export const updateGameStats = `mutation UpdateGameStats($input: UpdateGameStatsInput!) {
  updateGameStats(input: $input) {
    id
    meetupId
    name
    date
    gameId
    year
    month
    fieldName
    tournamentName
    winners
    losers
  }
}
`;
export const deleteGameStats = `mutation DeleteGameStats($input: DeleteGameStatsInput!) {
  deleteGameStats(input: $input) {
    id
    meetupId
    name
    date
    gameId
    year
    month
    fieldName
    tournamentName
    winners
    losers
  }
}
`;
export const createPlayerStats = `mutation CreatePlayerStats($input: CreatePlayerStatsInput!) {
  createPlayerStats(input: $input) {
    id
    name
    meetupId
    gamesPlayed
    o
    singles
    doubles
    triples
    rbi
    r
    hr
    sb
    cs
    bb
    k
    sac
    ab
    h
    tb
    rc
    woba
    ops
    obp
    avg
    w
    l
  }
}
`;
export const updatePlayerStats = `mutation UpdatePlayerStats($input: UpdatePlayerStatsInput!) {
  updatePlayerStats(input: $input) {
    id
    name
    meetupId
    gamesPlayed
    o
    singles
    doubles
    triples
    rbi
    r
    hr
    sb
    cs
    bb
    k
    sac
    ab
    h
    tb
    rc
    woba
    ops
    obp
    avg
    w
    l
  }
}
`;
export const deletePlayerStats = `mutation DeletePlayerStats($input: DeletePlayerStatsInput!) {
  deletePlayerStats(input: $input) {
    id
    name
    meetupId
    gamesPlayed
    o
    singles
    doubles
    triples
    rbi
    r
    hr
    sb
    cs
    bb
    k
    sac
    ab
    h
    tb
    rc
    woba
    ops
    obp
    avg
    w
    l
  }
}
`;
