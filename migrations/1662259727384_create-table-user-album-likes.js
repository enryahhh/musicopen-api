/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
      onDelete: 'cascade',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: '"albums"',
      onDelete: 'cascade',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
