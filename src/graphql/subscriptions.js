// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateGameStats = `subscription OnCreateGameStats(
  $id: ID
  $meetupId: String
  $name: String
  $date: String
  $gameId: String
) {
  onCreateGameStats(
    id: $id
    meetupId: $meetupId
    name: $name
    date: $date
    gameId: $gameId
  ) {
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
export const onUpdateGameStats = `subscription OnUpdateGameStats(
  $id: ID
  $meetupId: String
  $name: String
  $date: String
  $gameId: String
) {
  onUpdateGameStats(
    id: $id
    meetupId: $meetupId
    name: $name
    date: $date
    gameId: $gameId
  ) {
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
export const onDeleteGameStats = `subscription OnDeleteGameStats(
  $id: ID
  $meetupId: String
  $name: String
  $date: String
  $gameId: String
) {
  onDeleteGameStats(
    id: $id
    meetupId: $meetupId
    name: $name
    date: $date
    gameId: $gameId
  ) {
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
