/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
class ExportsHandler {
  constructor(service, playlistService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    const { id } = request.params;
    const message = {
      userId: request.auth.credentials.id,
      playlistId: id,
      targetEmail: request.payload.targetEmail,
    };

    await this._playlistService.verifyOwner(id, request.auth.credentials.id);

    await this._service.sendMessage('export:songsInPlaylist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
