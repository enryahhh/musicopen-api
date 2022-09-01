/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createType('aksi', ['add', 'delete']);
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: '"playlists"',
      onDelete: 'cascade',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'aksi',
      notNull: true,
    },
    time: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
  pgm.dropType('aksi');
};
