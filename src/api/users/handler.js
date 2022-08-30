/* eslint-disable no-underscore-dangle */
class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
  }

  async postUserHandler(request, h) {
    // console.log(this._validator);
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this._service.registerUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const user = await this._service.getUserById(id);
      const response = h.response({
        status: 'success',
        data: {
          user,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getUsersByUsernameHandler(request) {
    try {
      const { username = '' } = request.query;
      const users = await this._service.getUsersByUsername(username);
      return {
        status: 'success',
        data: {
          users,
        },
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = UsersHandler;
