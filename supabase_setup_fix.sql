-- auth.users テーブルに username と avatar_url カラムを追加
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- profiles ビューを更新
CREATE OR REPLACE VIEW profiles AS
SELECT id, email, username, avatar_url
FROM auth.users;

-- 既存のテーブルとビューが正しく作成されていることを確認
-- problems テーブル
CREATE TABLE IF NOT EXISTS problems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  hand TEXT NOT NULL,
  description TEXT,
  round TEXT NOT NULL,
  turn TEXT NOT NULL,
  scores TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- likes テーブル
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  problem_id UUID REFERENCES problems(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(user_id, problem_id)
);

-- follows テーブル
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id),
  followed_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(follower_id, followed_id)
);