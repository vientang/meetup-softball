// eslint-disable
// this is an auto generated file. This will be overwritten

export const getGameStats = `query GetGameStats($id: ID!) {
  getGameStats(id: $id) {
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
export const listGameStatss = `query ListGameStatss(
  $filter: ModelGameStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameStatss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getPlayerStats = `query GetPlayerStats($id: ID!) {
  getPlayerStats(id: $id) {
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
export const listPlayerStatss = `query ListPlayerStatss(
  $filter: ModelPlayerStatsFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlayerStatss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
