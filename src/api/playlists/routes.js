const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'musicopenapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getAllPlaylistsHandler,
    options: {
      auth: 'musicopenapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'musicopenapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongsInPlaylistByIdHandler,
    options: {
      auth: 'musicopenapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongsInPlaylistByIdHandler,
    options: {
      auth: 'musicopenapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongsInPlaylistByIdHandler,
    options: {
      auth: 'musicopenapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getLogsPlaylistActivitiesHandler,
    options: {
      auth: 'musicopenapi_jwt',
    },
  },
];

module.exports = routes;
