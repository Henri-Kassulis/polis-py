from django.urls import path
from . import views
from . import api
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # template views
    path("", views.home, name="home"),
    path("topics", views.topics, name="topics"),
    path('topics/new/', views.topic_create, name='topic_create'),
    path('topics/<int:pk>/', views.topic_detail, name='topic_detail'),
    path('topics/<int:topic_id>/statements/new/', views.statement_create, name='statement_create'),
    path('topics/<int:topic_id>/statements/bulk/', views.bulk_statements_create, name='bulk_statements_create'),
    path('login/', views.name_login, name='name_login'),
    path('logout/', views.logout, name='logout'),
    path('topics/<int:topic_id>/voting', views.start_voting, name='start_voting'),
    path('topics/<int:topic_id>/vote/<int:statement_id>/', views.submit_vote, name='submit_vote'),
    path('topics/<int:topic_id>/results/', views.results_view, name='results'),
    # api
    path('api/topics/', api.TopicListView.as_view(), name='topic-list'),
    path('api/topics/<int:id>/', api.TopicDetailView.as_view(), name='topic-detail'),
    path('api/topics/<int:topic_id>/statements/', api.StatementListCreateAPIView.as_view(), name='api-statement-list-create'),
    path('api/topics/<int:topic_id>/statements/bulk/', api.BulkCreateStatementsView.as_view(), name='bulk_create_statements'),
    path("api/votes/", api.VoteAPIView.as_view(), name="vote-api"),
    path('api/votes/<int:topic_id>/<uuid:user_uuid>/', api.RandomUnvotedStatementAPIView.as_view(), name='random-unvoted-statement'),
    path("api/votes/<int:topic_id>/results/", api.TopicVoteResultsView.as_view()),
    # login
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
