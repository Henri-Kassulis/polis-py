
from rest_framework import generics
from .models import Statement, Topic, User, Vote
from .serializers import StatementSerializer, TopicSerializer, VoteSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random

class TopicListView(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

class TopicDetailView(generics.RetrieveAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    lookup_field = 'id'  # optional, Standard ist 'pk'


class StatementListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = StatementSerializer

    def get_queryset(self):
        topic_id = self.kwargs['topic_id']
        return Statement.objects.filter(topic_id=topic_id)

    def perform_create(self, serializer):
        topic_id = self.kwargs['topic_id']
        serializer.save(topic_id=topic_id)


class BulkCreateStatementsView(APIView):
    def post(self, request, topic_id):
        try:
            topic = Topic.objects.get(id=topic_id)
        except Topic.DoesNotExist:
            return Response({'error': 'Topic not found'}, status=status.HTTP_404_NOT_FOUND)

        bulk_text = request.data.get('text', '')
        if not bulk_text.strip():
            return Response({'error': 'Text is empty'}, status=status.HTTP_400_BAD_REQUEST)

        lines = [line.strip() for line in bulk_text.strip().split('\n') if line.strip()]
        created_statements = []

        for line in lines:
            stmt = Statement.objects.create(text=line, topic=topic)
            created_statements.append({'id': stmt.id, 'text': stmt.text})

        return Response({'created': created_statements}, status=status.HTTP_201_CREATED)



class RandomUnvotedStatementAPIView(APIView):
    def get(self, request, topic_id, user_uuid):
        try:
            topic = Topic.objects.get(pk=topic_id)
        except Topic.DoesNotExist:
            return Response({"detail": "Topic nicht gefunden"}, status=status.HTTP_404_NOT_FOUND)
        
        user, _ = User.objects.get_or_create(uuid=user_uuid)

        # IDs der Statements, die User bereits gevotet hat
        voted_statement_ids = Vote.objects.filter(user=user).values_list('statement_id', flat=True)

        # Statements aus Topic, die noch nicht gevotet sind
        available_statements = topic.statements.exclude(id__in=voted_statement_ids)

        if not available_statements.exists():
            return Response({"detail": "Keine neuen Statements"}, status=status.HTTP_404_NOT_FOUND)

        # Zufälliges Statement auswählen
        statement = random.choice(available_statements)

        serializer = StatementSerializer(statement)
        return Response(serializer.data)


class VoteAPIView(APIView):
    def post(self, request, format=None):
        serializer = VoteSerializer(data=request.data)
        if serializer.is_valid():
            vote = serializer.save()
            return Response({"success": True, "vote_id": vote.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)