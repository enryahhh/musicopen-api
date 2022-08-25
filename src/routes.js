const { deleteAlbumByIdHandler } = require('./handler');
const { editAlbumByIdHandler } = require('./handler');
const { getAlbumByIdHandler } = require('./handler');
const { addAlbumHandler, getAllAlbumsHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/albums',
    handler: addAlbumHandler,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: getAllAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: editAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: deleteAlbumByIdHandler,
  },
];

module.exports = routes;
