/* eslint-disable class-methods-use-this */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const mapDBToModel = require('../../utils');
/* eslint-disable no-underscore-dangle */
class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, NULL, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBToModel.mapAlbumDBToModel);
  }

  async getAlbumById(albumId) {
    const query = {
      text: 'SELECT albums.*, songs.id as song_id, songs.title, songs.performer FROM albums LEFt JOIN songs ON albums.id = songs."albumId" WHERE albums.id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return mapDBToModel.mapAlbumWithSongModel(result.rows);
  }

  async updateAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal update album. id tidak ditemukan');
    }
  }

  async updateAlbumCover(id, cover) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET cover = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [cover, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal update cover album. id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. id tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
