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
    this.getLogsPlaylistActivitiesHandler = this.getLogsPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
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
  }

  async postSongsInPlaylistByIdHandler(request, h) {
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    this._validator.validatePlaylistSongPayload(request.payload);
    await this._service.verifySongId(songId);
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addSongToPlaylist(playlistId, songId);
    await this._service.insertLog('add', credentialId, playlistId, songId);
    const response = h.response({
      status: 'success',
      message: 'Sukses menambah lagu ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._service.getSongsInPlaylist(id);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongsInPlaylistByIdHandler(request, h) {
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    this._validator.validatePlaylistSongPayload(request.payload);

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.deleteSongFromPlaylist(songId, id);
    await this._service.insertLog('delete', credentialId, id, songId);
    const response = h.response({
      status: 'success',
      message: 'Sukses menghapus lagu dari playlist',
    });
    response.code(200);
    return response;
  }

  async getLogsPlaylistActivitiesHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyPlaylistAccess(id, credentialId);
    const playlistLog = await this._service.getLog(id);
    return {
      status: 'success',
      data: playlistLog,
    };
  }
}

module.exports = PlaylistsHandler;
