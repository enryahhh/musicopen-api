/* eslint-disable class-methods-use-this */
const { nanoid } = require('nanoid');
/* eslint-disable no-underscore-dangle */
class AlbumService {
  constructor() {
    this._albums = [];
  }

  addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newAlbum = {
      id, name, year, createdAt, updatedAt,
    };

    this._albums.push(newAlbum);

    const isSuccess = this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new Error('Album gagal ditambahkan');
    }

    return id;
  }

  getAlbums() {
    return this._albums;
  }

  getAlbumById(albumId) {
    const album = this._albums.filter((a) => a.id === albumId)[0];
    if (!album) {
      throw new Error('Album tidak ditemukan');
    }
    return album;
  }

  updateAlbumById(id, { name, year }) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new Error('Gagal upde album. id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();

    this._albums[index] = {
      ...this._albums[index],
      name,
      year,
      updatedAt,
    };
  }

  deleteAlbumById(id) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new Error('Gagal upde album. id tidak ditemukan');
    }

    this._albums.splice(index, 1);
  }
}

module.exports = AlbumService;
