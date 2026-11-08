-- ============================================================================
-- ARENA-E-SPORT-V2 — SCHEMA POSTGRESQL PRODUCTION POUR SUPABASE
-- GitHub Repository: alankaredis2006-rgb/ARENA-E-SPORT-V2
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table: Profiles (Joueurs, Capitaines, Arbitres)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  in_game_uid TEXT UNIQUE,
  role TEXT DEFAULT 'player' CHECK (role IN ('player', 'captain', 'admin')),
  wallet_balance_fcfa BIGINT DEFAULT 0 CHECK (wallet_balance_fcfa >= 0),
  preferred_currency TEXT DEFAULT 'FCFA' CHECK (preferred_currency IN ('FCFA', 'EUR', 'USD', 'GBP')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: Squads (100 Escouades de Tournoi)
CREATE TABLE IF NOT EXISTS public.squads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  flag TEXT NOT NULL,
  pool TEXT NOT NULL CHECK (pool IN ('Pool A', 'Pool B', 'Pool C', 'Pool D')),
  captain_id UUID REFERENCES public.profiles(id),
  matches_played INT DEFAULT 0,
  total_kills INT DEFAULT 0,
  placement_points INT DEFAULT 0,
  total_score INT DEFAULT 0,
  status TEXT DEFAULT 'en_course' CHECK (status IN ('qualifiée', 'en_course', 'éliminée')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: Squad Members (4 Joueurs par Squad)
CREATE TABLE IF NOT EXISTS public.squad_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  player_name TEXT NOT NULL,
  role TEXT DEFAULT 'Fragger' CHECK (role IN ('Capitaine', 'Fragger', 'Sniper', 'Rusher', 'Support')),
  in_game_uid TEXT NOT NULL,
  kills INT DEFAULT 0
);

-- 4. Table: Rooms (Rooms 01 à 10)
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_number INT NOT NULL UNIQUE CHECK (room_number BETWEEN 1 AND 10),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  stage TEXT NOT NULL,
  map TEXT NOT NULL CHECK (map IN ('Bermuda', 'Purgatory', 'Kalahari', 'Alpine', 'NexTerra')),
  status TEXT DEFAULT 'standby' CHECK (status IN ('live', 'standby', 'completed')),
  scheduled_time TIMESTAMPTZ,
  game_room_id TEXT NOT NULL,
  game_password TEXT NOT NULL,
  max_squads INT DEFAULT 12,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table: Room Match Scores (Scores en Direct Free Fire)
CREATE TABLE IF NOT EXISTS public.room_match_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE,
  kills INT DEFAULT 0,
  placement_pts INT DEFAULT 0,
  total_pts INT GENERATED ALWAYS AS (kills + placement_pts) STORED,
  is_alive BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table: Transactions & Passerelle Nexus Africa
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_fcfa BIGINT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('topup', 'tournament_entry', 'subscription', 'cashprize')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  payment_method TEXT NOT NULL,
  nexus_transaction_id TEXT UNIQUE,
  reference TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Table: Abonnements & Pass (Challenger, Pro, Elite)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier_id TEXT NOT NULL CHECK (tier_id IN ('sub_challenger', 'sub_pro', 'sub_elite')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Public read squads" ON public.squads FOR SELECT USING (true);
CREATE POLICY "Public read room status" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Users read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users read their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Wallet credit procedure
CREATE OR REPLACE FUNCTION public.increment_wallet_balance(user_uuid UUID, amount BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET wallet_balance_fcfa = wallet_balance_fcfa + amount,
      updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
