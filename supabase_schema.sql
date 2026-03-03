-- 1. Create a table to hold user profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text,
  full_name text,
  avatar_url text,
  game_data jsonb default '{}'::jsonb, -- Store game progress here
  
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- 3. Create Policy: Users can view their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- 4. Create Policy: Users can insert their own profile
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- 5. Create Policy: Users can update their own profile
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- 6. (Optional) Trigger to create profile on signup
-- This ensures every new user has a row in 'profiles' automatically
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, game_data)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', '{}'::jsonb);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
