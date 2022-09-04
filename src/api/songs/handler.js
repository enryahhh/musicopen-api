/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title = 'untitled', year, genre, performer, duration, albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'Sukses menambahkan lagu',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getAllSongsHandler(request, h) {
    let rawSongs;
    if (request.query.title !== undefined || request.query.performer !== undefined) {
      rawSongs = await this._service.getSongsBySearch(request.query);
    } else {
      rawSongs = await this._service.getAllSong();
    }
    // eslint-disable-next-line max-len
    const songs = rawSongs.map((e) => (({ id, title, performer }) => ({ id, title, performer }))(e));
    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const songId = request.params.id;
    const song = await this._service.getSongById(songId);
    // const song = (({ id, title, performer }) => ({ id, title, performer }))(rawsong);
    const response = h.response({
      status: 'success',
      data: {
        song: song[0],
      },
    });
    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Sukses mengubah lagu',
      data: {
        songId: id,
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: ' Berhasil menghapus Lagu',
    };
  }
}

module.exports = SongsHandler;
