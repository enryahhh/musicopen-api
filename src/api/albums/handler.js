/* eslint-disable no-underscore-dangle */
class AlbumsHandler {
  constructor(service) {
    this._service = service;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAllAlbumsHandler = this.getAllAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  postAlbumHandler(request, h) {
    try {
      const { name = 'untitled', year } = request.payload;

      const albumId = this._service.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        message: 'Sukses menambahkan album',
        data: {
          albumId,
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

  getAllAlbumsHandler() {
    const albums = this._service.getAlbums();

    return {
      status: 'success',
      message: 'Sukses menambahkan album',
      data: {
        albums,
      },
    };
  }

  getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const album = this._service.getAlbumById(id);

      const response = h.response({
        status: 'success',
        data: {
          album,
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

  putAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;

      this._service.updateAlbumById(id, request.payload);

      const response = h.response({
        status: 'success',
        message: 'Sukses mengubah album',
        data: {
          albumId: id,
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

  deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;

      this._service.deleteAlbumById(id);

      return {
        status: 'success',
        message: ' Berhasil menghapus Album',
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

module.exports = AlbumsHandler;
