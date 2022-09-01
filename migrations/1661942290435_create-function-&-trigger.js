/* eslint-disable camelcase */
// gagal teruss. Sarannya kak
exports.up = (pgm) => {
  pgm.createFunction('log_playlist', [], {
    language: 'SQL',
    returns: `TRIGGER
                AS $$
                BEGIN
                INSERT INTO playlist_song_activities(playlist_id,song_id,user_id,action,time) VALUES
                (OLD.playlist_id,OLD.song_id,OLD.playlists.owner,'add',NOW())
                `,
  });

  pgm.createFunction('log_playlist2', [], {
    language: 'SQL',
    returns: `TRIGGER
                AS $$
                BEGIN
                INSERT INTO playlist_song_activities(playlist_id,song_id,user_id,action,time) VALUES
                (OLD.playlist_id,OLD.song_id,OLD.playlists.owner,'delete',NOW())
                `,
  });

  pgm.createTrigger('playlist_songs', 'playlist_activities', {
    when: 'AFTER',
    operation: 'INSERT',
    constraint: true,
    function: 'log_playlist',
    level: 'ROW',
  });
};

exports.down = (pgm) => {
  pgm.dropFunction('log_playlist');
  pgm.dropFunction('log_playlist2');
  pgm.dropTrigger('playlist_songs', 'playlist_songs');
};
