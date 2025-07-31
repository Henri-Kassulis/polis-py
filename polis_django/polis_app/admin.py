from django.contrib import admin
from .models import Topic, Statement, User, Vote

# Register your models here.
for i in [Topic,Statement, User, Vote]:
    admin.site.register(i)
