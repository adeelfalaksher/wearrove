CREATE TABLE IF NOT EXISTS saved_pieces (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  garment_id TEXT NOT NULL REFERENCES garments(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  PRIMARY KEY(user_id,garment_id)
);
CREATE TABLE IF NOT EXISTS preview_reviews (
  job_id TEXT PRIMARY KEY REFERENCES tryon_jobs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  decision TEXT NOT NULL CHECK(decision IN ('ready','concern')),
  face_checked INTEGER NOT NULL CHECK(face_checked IN (0,1)),
  garment_checked INTEGER NOT NULL CHECK(garment_checked IN (0,1)),
  colour_checked INTEGER NOT NULL CHECK(colour_checked IN (0,1)),
  notes TEXT NOT NULL DEFAULT '' CHECK(length(notes)<=400),
  updated_at INTEGER NOT NULL,
  CHECK(decision<>'ready' OR (face_checked=1 AND garment_checked=1 AND colour_checked=1))
);
