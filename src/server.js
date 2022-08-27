require('dotenv').config();

const Hapi = require('@hapi/hapi');
const album = require('./api/albums');
const song = require('./api/songs');
const AlbumService = require('./services/postgre/AlbumsService');
const SongsService = require('./services/postgre/SongsService');
const AlbumValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const albumService = new AlbumService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
