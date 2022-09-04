/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

class UploadsHandler {
  constructor(service, albumService, validator) {
    this._service = service;
    this._albumService = albumService;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id } = request.params;
      this._validator.validateImageHeaders(cover.hapi.headers);
      const filename = await this._service.writeFile(cover, cover.hapi);
      await this._albumService.updateAlbumCover(id, filename);
      const response = h.response({
        status: 'success',
        message: 'Berhasil upload',
        data: {
          fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = UploadsHandler;
