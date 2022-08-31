/* eslint-disable no-underscore-dangle */
// const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getAllPlaylistsHandler = this.getAllPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongsInPlaylistByIdHandler = this.postSongsInPlaylistByIdHandler.bind(this);
    this.getSongsInPlaylistByIdHandler = this.getSongsInPlaylistByIdHandler.bind(this);
    this.deleteSongsInPlaylistByIdHandler = this.deleteSongsInPlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    console.log(request.payload);
    try {
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist(name, credentialId);
      const response = h.response({
        status: 'success',
        message: 'Sukses menambahkan playlist',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return error;
    }
  }

  async getAllPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      message: 'Sukses menampilkan playlist',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyOwner(id, credentialId);
      await this._service.deletePlaylistById(id);
      const response = h.response({
        status: 'success',
        message: 'Sukses menghapus playlist',
      });
      response.code(200);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return error;
    }
  }

  async postSongsInPlaylistByIdHandler(request, h) {
    try {
      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      this._validator.validatePlaylistSongPayload(request.payload);
      await this._service.verifySongId(songId);
      await this._service.verifyOwner(playlistId, credentialId);
      await this._service.addSongToPlaylist(playlistId, songId);
      const response = h.response({
        status: 'success',
        message: 'Sukses menambah lagu ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return error;
    }
  }

  async getSongsInPlaylistByIdHandler(request) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyOwner(id, credentialId);
      const playlist = await this._service.getSongsInPlaylist(id);
      return {
        status: 'success',
        data: {
          playlist,
        },
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteSongsInPlaylistByIdHandler(request, h) {
    try {
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;
      this._validator.validatePlaylistSongPayload(request.payload);

      await this._service.verifyOwner(id, credentialId);
      await this._service.deleteSongFromPlaylist(songId, id);
      const response = h.response({
        status: 'success',
        message: 'Sukses menghapus lagu dari playlist',
      });
      response.code(200);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return error;
    }
  }
}

module.exports = PlaylistsHandler;
