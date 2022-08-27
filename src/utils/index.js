/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapSongDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapAlbumWithSongModel = (data) => {
  const newObj = {};
  const songs = [];
  let lastAlbumId = null;

  data.forEach((e) => {
    if (e.id !== lastAlbumId) {
      newObj.id = e.id;
      newObj.name = e.name;
      newObj.year = e.year;
    }
    if (newObj.id === e.id) {
      songs.push({ id: e.song_id, title: e.title, performer: e.performer });
    }
    newObj.songs = songs;
    lastAlbumId = e.id;
  });

  return newObj;
};

module.exports = { mapAlbumDBToModel, mapSongDBToModel, mapAlbumWithSongModel };
