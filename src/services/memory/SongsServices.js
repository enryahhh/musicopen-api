/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
const { nanoid } = require('nanoid');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newSong = {
      id, title, year, genre, performer, duration, albumId, createdAt, updatedAt,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new Error('Album gagal ditambahkan');
    }

    return id;
  }

  getAllSong() {
    return this._songs.map((e) => (({ id, title, performer }) => ({ id, title, performer }))(e));
  }

  getSongById(id) {
    const lagu = this._songs.filter((song) => song.id === id)[0];

    if (!lagu) {
      throw new Error('Song tidak ditemukan');
    }

    return lagu;
  }

  editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new Error('Song tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();

    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
      updatedAt,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new Error('Song tidak ditemukan');
    }

    this._songs.splice(index, 1);
  }
}

module.exports = SongsService;
