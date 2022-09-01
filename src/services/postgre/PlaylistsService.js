/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const mapDBToModel = require('../../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT playlists.id,playlists.name,users.username FROM playlists JOIN users ON playlists.owner = users.id WHERE owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlist. id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan songs ke playlist');
    }

    return result.rows[0].id;
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `SELECT playlists.id,playlists.name, songs.id AS song_id, songs.title, songs.performer, users.username FROM playlists JOIN playlist_songs ON playlists.id = playlist_songs."playlist_id" 
             JOIN songs ON songs.id = playlist_songs."song_id" 
             JOIN users ON playlists.owner = users.id WHERE playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return mapDBToModel.mapPlaylistInSongModel(result.rows);
  }

  async deleteSongFromPlaylist(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu dari playlist. id tidak ditemukan');
    }
  }

  async verifySongId(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('lagu tidak ditemukan');
    }
  }

  async verifyOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    console.log(id);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      console.log(playlist.owner);
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async insertLog(action, userId, playlistId, songId) {
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities(playlist_id, song_id, user_id, action, time) VALUES($1,$2,$3,$4,$5) RETURNING id',
      values: [playlistId, songId, userId, action, createdAt],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan log playlist');
    }
  }

  // async getPlaylistById(id) {
  //   const query = {
  //     text: 'SELECT * FROM playlists WHERE id = $1',
  //     values: [id],
  //   };

  //   const result = await this._pool.query(query);
  //   if (!result.rows.length) {
  //     throw new NotFoundError('playlist tidak ditemukan');
  //   }
  // }

  async getLog(id) {
    const query = {
      text: `SELECT playlist_song_activities.*, users.username, songs.title
             FROM playlist_song_activities JOIN users ON playlist_song_activities.user_id = users.id
             JOIN songs ON playlist_song_activities.song_id = songs.id WHERE playlist_song_activities.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return mapDBToModel.mapLogPlaylist(result.rows);
  }

  // async verifyNoteAccess(playlistId, userId) {
  //   try {
  //     await this.verifyOwner(playlistId, userId);
  //   } catch (error) {
  //     if (error instanceof NotFoundError) {
  //       throw error;
  //     }
  //     try {
  //       await this._collaborationService.verifyCollaborator(noteId, userId);
  //     } catch {
  //       throw error;
  //     }
  //   }
  // }
}

module.exports = PlaylistsService;
