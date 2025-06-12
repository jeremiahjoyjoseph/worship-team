import json
import random

roles = [
    'worship-team-member', 'worship-leader', 'worship-pastor',
    'media-team', 'sound-team', 'admin', 'guest'
]
genders = ['male', 'female']
locations = ['central', 'north', 'south', 'east', 'west']
band_roles = ['vocals', 'drums', 'keys', 'acoustic', 'bass', 'electric']
months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

users = []
for i in range(100):
    role = random.choice(roles)
    gender = random.choice(genders)
    dob = f"{random.randint(1,28)} {random.choice(months)} {random.randint(1970,2005)}"
    base = {
        'firstName': f'User{i+1}',
        'lastName': f'Last{i+1}',
        'username': f'user{i+1}',
        'email': f'user{i+1}@example.com',
        'phone': f'{1000000000+i:010d}',
        'password': 'Password123!',
        'role': role,
        'gender': gender,
        'dob': dob,
        'status': 'active'
    }
    if role in ['worship-team-member', 'worship-leader', 'worship-pastor']:
        base['wtRolePrimary'] = random.choice(band_roles)
        base['locationPrimary'] = random.choice(locations)
        if random.random() > 0.5:
            base['wtRoleSecondary'] = random.choice(band_roles)
        if random.random() > 0.7:
            base['wtRoleSpare'] = random.choice(band_roles)
        if random.random() > 0.5:
            base['locationSecondary'] = random.choice(locations)
        if random.random() > 0.7:
            base['locationSpare'] = random.choice(locations)
    users.append(base)

with open('sample_users_100.json', 'w') as f:
    json.dump({'users': users}, f, indent=2) 