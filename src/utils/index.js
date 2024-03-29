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
      newObj.coverUrl = (e.cover !== null ? `http://${process.env.HOST}:${process.env.PORT}/upload/images/${e.cover}` : e.cover);
    }
    if (newObj.id === e.id && e.song_id !== null) {
      songs.push({ id: e.song_id, title: e.title, performer: e.performer });
    }
    newObj.songs = songs;
    lastAlbumId = e.id;
  });

  return newObj;
};

const mapPlaylistInSongModel = (data) => {
  const newObj = {};
  const songs = [];
  let lastPlaylistId = null;

  data.forEach((e) => {
    if (e.id !== lastPlaylistId) {
      newObj.id = e.id;
      newObj.name = e.name;
      newObj.username = e.username;
    }
    if (newObj.id === e.id && e.song_id !== null) {
      songs.push({ id: e.song_id, title: e.title, performer: e.performer });
    }
    newObj.songs = songs;
    lastPlaylistId = e.id;
  });

  return newObj;
};

const mapLogPlaylist = (data) => {
  const newObj = {};
  const activities = [];
  let lastPlaylistId = null;

  data.forEach((e) => {
    if (e.playlistId !== lastPlaylistId) {
      newObj.playlistId = e.playlist_id;
    }
    if (newObj.playlistId === e.playlist_id) {
      activities.push({
        username: e.username, title: e.title, action: e.action, time: e.time,
      });
    }
    newObj.activities = activities;
    lastPlaylistId = e.playlist_id;
  });

  return newObj;
};

module.exports = {
  mapAlbumDBToModel,
  mapSongDBToModel,
  mapAlbumWithSongModel,
  mapPlaylistInSongModel,
  mapLogPlaylist,
};
