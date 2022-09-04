const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: handler.postExportPlaylistsHandler,
    options: {
      auth: 'musicopenapi_jwt',
    },
  },
];

module.exports = routes;
