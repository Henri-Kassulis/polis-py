from rest_framework import serializers
from .models import Statement, Topic, Vote, User

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name', 'description']  

# serializers.py
class StatementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statement
        fields = ['id', 'topic', 'text']


class VoteSerializer(serializers.ModelSerializer):
    user_uuid = serializers.UUIDField(write_only=True)
    vote = serializers.CharField(write_only=True)  # <-- überschreibt das ChoiceField
    
    class Meta:
        model = Vote
        fields = ["user_uuid", "statement", "vote"]

    def validate_vote(self, value):
        VOTE_MAP = {
            "agree": Vote.AGREE,
            "neutral": Vote.PASS,
            "disagree": Vote.DISAGREE,
        }
        if value not in VOTE_MAP:
            raise serializers.ValidationError(f"Ungültiger Wert: {value}")
        return VOTE_MAP[value]

    def create(self, validated_data):
        user_uuid = validated_data.pop("user_uuid")
        user, created = User.objects.get_or_create(uuid=user_uuid)
        return Vote.objects.create(user=user, **validated_data)