import uuid
from django.db import models
from django.utils import timezone

# Create your models here.

class Topic(models.Model):
    name = models.CharField()
    description = models.CharField(blank=True)


class User(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, null=True)
    name = models.CharField(max_length=150, blank=True, null=True)  # optional
    created_at = models.DateTimeField(default=timezone.now)

class Statement(models.Model):
    text = models.CharField()
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="statements")

class Vote(models.Model):
    AGREE = 1
    DISAGREE = -1
    PASS = 0

    VOTE_CHOICES = [
        (AGREE, "Agree"),
        (DISAGREE, "Disagree"),
        (PASS, "Pass"),
    ]    

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    statement = models.ForeignKey(Statement, on_delete=models.CASCADE, related_name="votes")
    vote = models.IntegerField(choices=VOTE_CHOICES)