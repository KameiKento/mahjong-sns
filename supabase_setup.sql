-- profiles ビューの作成
CREATE OR REPLACE VIEW profiles AS
SELECT id, email, raw_user_meta_data->>'full_name' as full_name, raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users;

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