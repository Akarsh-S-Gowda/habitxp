create or replace function public.complete_habit(p_habit_id uuid)
returns table (
  status text,
  xp_gained integer,
  total_xp integer,
  streak_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_today date := (now() at time zone 'utc')::date;
  v_last_completion date;
  v_habit record;
  v_total_xp integer;
  v_new_streak integer;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  select id, xp_reward, streak_count
  into v_habit
  from public.habits
  where id = p_habit_id
    and user_id = v_user_id
    and is_active = true
  for update;

  if not found then
    raise exception 'Habit not found';
  end if;

  if exists (
    select 1
    from public.habit_completions
    where habit_id = p_habit_id
      and user_id = v_user_id
      and completion_date = v_today
  ) then
    select coalesce(total_xp, 0) into v_total_xp
    from public.profiles
    where user_id = v_user_id;

    return query
    select 'already_completed'::text, 0, coalesce(v_total_xp, 0), v_habit.streak_count;
    return;
  end if;

  select max(completion_date)
  into v_last_completion
  from public.habit_completions
  where habit_id = p_habit_id
    and user_id = v_user_id;

  if v_last_completion = v_today - 1 then
    v_new_streak := v_habit.streak_count + 1;
  else
    v_new_streak := 1;
  end if;

  insert into public.habit_completions (
    habit_id, user_id, completion_date, xp_gained
  ) values (
    p_habit_id, v_user_id, v_today, v_habit.xp_reward
  );

  update public.habits
  set streak_count = v_new_streak
  where id = p_habit_id and user_id = v_user_id;

  insert into public.profiles (user_id, total_xp)
  values (v_user_id, v_habit.xp_reward)
  on conflict (user_id)
  do update set total_xp = public.profiles.total_xp + excluded.total_xp
  returning total_xp into v_total_xp;

  return query
  select 'completed'::text, v_habit.xp_reward, v_total_xp, v_new_streak;
end;
$$;
