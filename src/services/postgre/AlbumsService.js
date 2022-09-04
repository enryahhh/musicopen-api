/* eslint-disable class-methods-use-this */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const mapDBToModel = require('../../utils');
/* eslint-disable no-underscore-dangle */
class AlbumService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
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
      text: 'SELECT albums.*, songs.id as song_id, songs.title, songs.performer FROM albums LEFT JOIN songs ON albums.id = songs."albumId" WHERE albums.id = $1',
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

  async likesAlbumById(id, userId) {
    const query = {
      text: 'INSERT INTO user_album_likes(user_id,album_id) VALUES ($1, $2) RETURNING id',
      values: [userId, id],
    };

    const result = await this._pool.query(query);
    await this._cacheService.delete(`likes:${id}`);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }
  }

  async unlikeAlbumById(id, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, id],
    };

    const result = await this._pool.query(query);
    await this._cacheService.delete(`likes:${id}`);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal unlike album. id tidak ditemukan');
    }
  }

  async verifyAlbum(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menyukai album. id tidak ditemukan');
    }
  }

  async verifyLikeAlbum(id, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, id],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async getLikesAlbumById(id) {
    let cache = false;
    try {
      cache = true;
      const result = await this._cacheService.get(`likes:${id}`);
      return {
        likes: JSON.parse(result),
        cache,
      };
    } catch (error) {
      const query = {
        text: 'SELECT album_id, COUNT(album_id) AS likes FROM user_album_likes WHERE album_id = $1 GROUP BY album_id',
        values: [id],
      };

      const result = await this._pool.query(query);
      console.log(result.rows);
      cache = false;
      if (result.rowCount > 0) {
        await this._cacheService.set(`likes:${result.rows[0].album_id}`, JSON.stringify(result.rows[0].likes));
        return { likes: result.rows[0].likes, cache };
      }
      return { likes: 0, cache };
    }
  }
}

module.exports = AlbumService;
