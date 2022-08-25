const Hapi = require('@hapi/hapi');
const album = require('./api/albums');
const AlbumService = require('./services/memory/AlbumsServices');

const init = async () => {
  const albumService = new AlbumService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: album,
    options: {
      service: albumService,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
