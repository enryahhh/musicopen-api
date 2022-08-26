/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class SongsHandler {
  constructor(service) {
    this._service = service;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  postSongHandler(request, h) {
    try {
      const {
        title = 'untitled', year, genre, performer, duration, albumId,
      } = request.payload;

      const songId = this._service.addSong({
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
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: 'Album gagal ditambahkan',
      });
      response.code(500);
      return response;
    }
  }

  getAllSongsHandler() {
    const songs = this._service.getAllSong();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const song = this._service.getSongById(id);

      const response = h.response({
        status: 'success',
        data: {
          song,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  putSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      this._service.editSongById(id, request.payload);

      const response = h.response({
        status: 'success',
        message: 'Sukses mengubah album',
        data: {
          songId: id,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      this._service.deleteSongById(id);

      return {
        status: 'success',
        message: ' Berhasil menghapus Lagu',
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }
}

module.exports = SongsHandler;
