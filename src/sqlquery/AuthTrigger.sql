-- Remove old trigger
drop trigger if exists on_auth_user_created
on auth.users;


-- Replace function
create or replace function public.handle_new_user()

returns trigger

language plpgsql

security definer

set search_path = public

as $$

begin


    -- If user is admin, do not create marketplace profile

    if new.raw_user_meta_data->>'role' = 'admin' then

        return new;

    end if;



    -- Create normal user profile

    insert into public.profiles
    (
        id,
        full_name,
        email,
        phone,
        location,
        role
    )

    values
    (
        new.id,

        coalesce(
            new.raw_user_meta_data->>'full_name',
            'New User'
        ),

        new.email,

        new.raw_user_meta_data->>'phone',

        new.raw_user_meta_data->>'location',

        coalesce(
            new.raw_user_meta_data->>'role',
            'buyer'
        )
    );


    return new;


end;

$$;



-- Recreate trigger

create trigger on_auth_user_created

after insert on auth.users

for each row

execute procedure public.handle_new_user();