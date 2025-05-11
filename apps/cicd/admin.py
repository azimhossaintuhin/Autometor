from django.contrib import admin
from .models import *

models = [Language, Framework, Workflow]

for model in models:
    admin.site.register(model)