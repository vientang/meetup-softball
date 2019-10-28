/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGameStats = `query GetGameStats($id: ID!) {
  getGameStats(id: $id) {
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
export const listGameStatss = `query ListGameStatss(
  $filter: ModelGameStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameStatss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getPlayerStats = `query GetPlayerStats($id: ID!) {
  getPlayerStats(id: $id) {
    id
    name
    games
  }
}
`;
export const listPlayerStatss = `query ListPlayerStatss(
  $filter: ModelPlayerStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlayerStatss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      games
    }
    nextToken
  }
}
`;
export const getPlayers = `query GetPlayers($id: ID!) {
  getPlayers(id: $id) {
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
export const listPlayerss = `query ListPlayerss(
  $filter: ModelPlayersFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlayerss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      joined
      profile
      admin
      photos
      status
      gender
    }
    nextToken
  }
}
`;
export const getSummarizedStats = `query GetSummarizedStats($id: ID!) {
  getSummarizedStats(id: $id) {
    id
    stats
  }
}
`;
export const listSummarizedStatss = `query ListSummarizedStatss(
  $filter: ModelSummarizedStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  listSummarizedStatss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      stats
    }
    nextToken
  }
}
`;
export const getMetaData = `query GetMetaData($id: ID!) {
  getMetaData(id: $id) {
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
export const listMetaDatas = `query ListMetaDatas(
  $filter: ModelMetaDataFilterInput
  $limit: Int
  $nextToken: String
) {
  listMetaDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
