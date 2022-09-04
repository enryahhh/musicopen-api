/* eslint-disable no-underscore-dangle */
class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAllAlbumsHandler = this.getAllAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postLikesAlbumHandler = this.postLikesAlbumHandler.bind(this);
    this.getLikesAlbumHandler = this.getLikesAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = 'untitled', year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Sukses menambahkan album',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAllAlbumsHandler() {
    const albums = await this._service.getAlbums();

    return {
      status: 'success',
      message: 'Sukses menampilkan album',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });
    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.updateAlbumById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Sukses mengubah album',
      data: {
        albumId: id,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: ' Berhasil menghapus Album',
    };
  }

  async postLikesAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyAlbum(id);
    const isLiked = await this._service.verifyLikeAlbum(id, credentialId);
    let pesan = '';
    if (isLiked > 0) {
      await this._service.unlikeAlbumById(id, credentialId);
      pesan = ' Berhasil batal menyukai album ';
    } else {
      await this._service.likesAlbumById(id, credentialId);
      pesan = ' Berhasil menyukai album ';
    }
    const response = h.response({
      status: 'success',
      message: pesan,
    });
    response.code(201);
    return response;
  }

  async getLikesAlbumHandler(request, h) {
    const { id } = request.params;
    const likesTotal = await this._service.getLikesAlbumById(id);
    const response = h.response({
      status: 'success',
      message: 'Sukses menampilkan likes album',
      data: {
        likes: likesTotal.likes * 1,
      },
    });
    if (likesTotal.cache) {
      response.header('X-Data-Source', 'cache');
    }
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
