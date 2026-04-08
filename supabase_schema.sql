-- =============================================
-- MONYLINK — Schéma Supabase v2
-- Architecture : un compte, deux régions (africa / europe)
-- Flux principal : XAF via Mobile Money → EUR wallet → SEPA / Carte / Crypto
-- =============================================

-- ─── PROFILES ────────────────────────────────
create table public.profiles (
  id           uuid references auth.users on delete cascade primary key,
  full_name    text not null,
  phone        text not null,
  email        text,
  country      text not null,                          -- CM | GA | FR | BE | CH | DE
  region       text not null check (region in ('africa', 'europe')),
  monylink_id  text unique not null,                   -- MLK-A3F2 (4 chars alphanum)
  kyc_status   text default 'pending' check (kyc_status in ('pending', 'verified', 'rejected')),
  created_at   timestamp with time zone default now()
);

-- ─── WALLETS ─────────────────────────────────
-- Un wallet par devise par user
-- Africa  : XAF
-- Europe  : EUR + USDC (optionnel)
create table public.wallets (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  currency   text not null check (currency in ('EUR', 'XAF', 'USDC')),
  balance    numeric(15,2) default 0 not null check (balance >= 0),
  updated_at timestamp with time zone default now(),
  unique(user_id, currency)
);

-- ─── TRANSFERS (flux Africa → Europe) ────────
-- Initié par l'expéditeur africain (inscrit ou non)
-- Monétbil/Flutterwave → webhook → crédit wallet EUR
create table public.transfers (
  id              uuid default gen_random_uuid() primary key,
  sender_id       uuid references public.profiles(id),  -- null si non-inscrit
  sender_phone    text not null,
  sender_name     text not null default 'Expéditeur',
  recipient_id    uuid references public.profiles(id) not null,
  recipient_mlk_id text not null,                        -- MLK-A3F2
  amount_xaf      numeric(15,2) not null,
  amount_eur      numeric(15,2) not null,
  rate            integer not null default 700,           -- 1 EUR = 700 XAF
  method          text not null,                          -- orange_money | mtn_momo | airtel
  status          text default 'pending' check (status in ('pending','processing','completed','failed','expired')),
  provider_tx_id  text,                                   -- ID Monetbil/Flutterwave
  payment_url     text,                                   -- URL Monetbil pour payer
  reference       text unique not null,                   -- MLK-A3F2-XXXXXX
  created_at      timestamp with time zone default now(),
  completed_at    timestamp with time zone
);

-- ─── WITHDRAWALS (Europe → RIB SEPA) ─────────
create table public.withdrawals (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references public.profiles(id) on delete cascade not null,
  amount_eur       numeric(15,2) not null,
  fee_eur          numeric(10,2) default 0.99 not null,
  net_eur          numeric(15,2) not null,
  iban             text not null,
  bic              text,
  beneficiary_name text not null,
  label            text,
  status           text default 'pending' check (status in ('pending','processing','completed','failed')),
  sepa_ref         text,
  provider_tx_id   text,                                  -- ID Swan
  created_at       timestamp with time zone default now()
);

-- ─── CARDS (carte virtuelle Visa via Swan) ────
create table public.cards (
  id                  uuid default gen_random_uuid() primary key,
  user_id             uuid references public.profiles(id) on delete cascade not null,
  swan_card_id        text unique,
  last4               text,
  expiry              text,                               -- MM/YY
  holder_name         text,
  status              text default 'active' check (status in ('active','frozen','canceled')),
  spending_limit_eur  numeric(10,2) default 1000,
  created_at          timestamp with time zone default now()
);

-- ─── CRYPTO CONVERSIONS (EUR → USDC) ─────────
create table public.crypto_conversions (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  from_currency text not null default 'EUR',
  to_currency   text not null default 'USDC',
  amount_from   numeric(15,2) not null,
  amount_to     numeric(15,2) not null,
  rate          numeric(10,6) not null,
  status        text default 'completed' check (status in ('completed','failed')),
  created_at    timestamp with time zone default now()
);

-- ─── WEBHOOKS LOG ────────────────────────────
create table public.webhooks_log (
  id           uuid default gen_random_uuid() primary key,
  provider     text not null,
  payload      jsonb not null,
  reference    text,
  status       text default 'received',
  processed_at timestamp with time zone,
  created_at   timestamp with time zone default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles          enable row level security;
alter table public.wallets           enable row level security;
alter table public.transfers         enable row level security;
alter table public.withdrawals       enable row level security;
alter table public.cards             enable row level security;
alter table public.crypto_conversions enable row level security;

-- Policies : chaque user voit et modifie uniquement ses données
create policy "own profile"        on public.profiles          for all using (auth.uid() = id);
create policy "own wallets"        on public.wallets           for all using (auth.uid() = user_id);
create policy "own withdrawals"    on public.withdrawals       for all using (auth.uid() = user_id);
create policy "own cards"          on public.cards             for all using (auth.uid() = user_id);
create policy "own conversions"    on public.crypto_conversions for all using (auth.uid() = user_id);

-- Transfers : expéditeur OU destinataire peuvent voir
create policy "own transfers"      on public.transfers         for all
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

-- API publique : lecture seule du profil par monylink_id (pour /p/[mlkId])
create policy "public mlk lookup"  on public.profiles
  for select using (true);

-- webhooks_log : service role uniquement (pas de policy client)

-- =============================================
-- TRIGGER : création profil + wallet à l'inscription
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_mlk_id  text;
  v_region  text;
  v_country text;
begin
  v_country := coalesce(new.raw_user_meta_data->>'country', 'CM');

  -- Région selon le pays
  if v_country in ('CM', 'GA') then
    v_region := 'africa';
  else
    v_region := 'europe';
  end if;

  -- MLK-ID unique : MLK- + 4 chars aléatoires alphanum
  loop
    v_mlk_id := 'MLK-' || upper(
      translate(
        substring(encode(gen_random_bytes(3), 'base64') from 1 for 4),
        '+/=', 'XYZ'
      )
    );
    exit when not exists (select 1 from public.profiles where monylink_id = v_mlk_id);
  end loop;

  insert into public.profiles (id, full_name, phone, email, country, region, monylink_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    new.email,
    v_country,
    v_region,
    v_mlk_id
  );

  -- Wallet principal selon la région
  if v_region = 'africa' then
    insert into public.wallets (user_id, currency, balance) values (new.id, 'XAF', 0);
  else
    insert into public.wallets (user_id, currency, balance) values
      (new.id, 'EUR', 0),
      (new.id, 'USDC', 0);
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- INDEXES pour les requêtes fréquentes
-- =============================================
create index idx_profiles_mlk_id       on public.profiles(monylink_id);
create index idx_transfers_recipient   on public.transfers(recipient_id);
create index idx_transfers_sender      on public.transfers(sender_id);
create index idx_transfers_reference   on public.transfers(reference);
create index idx_wallets_user_currency on public.wallets(user_id, currency);
