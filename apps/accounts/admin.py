from django.contrib import admin
from .models import User, Userprofile, UserWallet

all_models = [User, Userprofile, UserWallet]

for model in all_models:
    admin.site.register(model)
