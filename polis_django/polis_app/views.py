from django.shortcuts import render, HttpResponse
from .models import Statement, Topic, User
from django.shortcuts import get_object_or_404
from .forms import StatementForm
from .forms import BulkStatementForm

# Create your views here.

def home(request):
    # return (HttpResponse("hello polis"))
    return render(request, "home.html")
    # return render(request, "polis_app/home.html")

def topics(request):
    topics = list( Topic.objects.all())
    newTopic= Topic(name="klima")
    newTopic.description ="emissionen stoppen"
    newTopic.name = "topic1"
    topic2= Topic(name="Demokratie", description="Faschismus verhindern")
    # topics.extend([newTopic, topic2])
    return render(request, "topics.html" , {"topics": topics})


from django.shortcuts import render, redirect
from .forms import TopicForm

def topic_create(request):
    if request.method == 'POST':
        form = TopicForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('topics')  # Nach Speichern zurück zur Liste
    else:
        form = TopicForm()
    return render(request, 'topic_form.html', {'form': form})

def topic_detail(request, pk):
    topic = get_object_or_404(Topic, pk=pk)
    return render(request, 'topic_detail.html', {'topic': topic})


def statement_create(request, topic_id):
    topic = get_object_or_404(Topic, pk=topic_id)

    if request.method == 'POST':
        form = StatementForm(request.POST)
        if form.is_valid():
            statement = form.save(commit=False)
            statement.topic = topic
            statement.save()
            return redirect('topic_detail', pk=topic.pk)
    else:
        form = StatementForm()

    return render(request, 'statement_form.html', {
        'form': form,
        'topic': topic
    })



def bulk_statements_create(request, topic_id):
    topic = get_object_or_404(Topic, pk=topic_id)

    if request.method == 'POST':
        form = BulkStatementForm(request.POST)
        if form.is_valid():
            raw_text = form.cleaned_data['raw_text']
            lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
            for line in lines:
                Statement.objects.create(topic=topic, text=line)
            return redirect('topic_detail', pk=topic.pk)
    else:
        form = BulkStatementForm()

    return render(request, 'statement_form_bulk.html', {
        'form': form,
        'topic': topic
    })


from .forms import NameLoginForm

def name_login(request):
    if request.method == 'POST':
        form = NameLoginForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            user, _ = User.objects.get_or_create(name=name)
            request.session['user_id'] = user.id
            request.session['username'] = name
            return redirect('topics')  # oder wohin du willst
    else:
        form = NameLoginForm()

    return render(request, 'name_login.html', {'form': form})

def logout(request):
    request.session.flush()
    return redirect('name_login')



def get_user(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return HttpResponseForbidden("Nicht eingeloggt.")

    user = get_object_or_404(User, pk=user_id)
    return user


from .models import Topic, Statement, Vote
from django.http import HttpResponseForbidden

def start_voting(request, topic_id):
    user = get_user(request)

    topic = get_object_or_404(Topic, pk=topic_id)

    # IDs der bereits bewerteten Statements
    voted_statement_ids = Vote.objects.filter(
        user=user
    ).values_list('statement_id', flat=True)

    # Erstes noch nicht bewertetes Statement holen
    statement = (
        Statement.objects
        .filter(topic=topic)
        .exclude(id__in=voted_statement_ids)
        .order_by('?')
        .first()
    )


    if not statement:
        return render(request, 'voting_done.html', {'topic': topic})

    return render(request, 'voting.html', {
        'topic': topic,
        'statement': statement
    })


# save vote
def submit_vote(request, topic_id, statement_id):
    if request.method != 'POST':
        return HttpResponseForbidden()

    user = get_user(request)

    value = request.POST.get('value')
    if value not in ['yes', 'neutral', 'no']:
        return HttpResponseForbidden("Ungültiger Wert.")
    
    VOTE_MAP = {
        'yes': Vote.AGREE,
        'neutral': Vote.PASS,
        'no': Vote.DISAGREE,
    }


    topic = get_object_or_404(Topic, pk=topic_id)
    statement = get_object_or_404(Statement, pk=statement_id, topic=topic)

    # Sicherstellen, dass noch nicht gevotet wurde
    already_voted = Vote.objects.filter(
        user=user, statement=statement
    ).exists()
    if not already_voted:
        Vote.objects.create(
            user=user,
            statement=statement,
            vote=VOTE_MAP.get(value)
        )

    return redirect('start_voting', topic_id=topic.pk)


from django.db.models import Count, Q
from .models import Topic, Statement

def results_view(request, topic_id):
    topic = get_object_or_404(Topic, pk=topic_id)

    # Alle Statements mit Vote-Zählung
    statements = topic.statements.annotate(
        agree_count=Count('votes', filter=Q(votes__vote=1)),
        neutral_count=Count('votes', filter=Q(votes__vote=0)),
        disagree_count=Count('votes', filter=Q(votes__vote=-1)),
    )

    processed = []
    for s in statements:
        total = s.agree_count + s.neutral_count + s.disagree_count
        if total == 0:
            agree_p = neutral_p = disagree_p = 0
        else:
            agree_p = s.agree_count / total * 100
            neutral_p = s.neutral_count / total * 100
            disagree_p = s.disagree_count / total * 100

        processed.append({
            'text': s.text,
            'agree': round(agree_p, 1),
            'neutral': round(neutral_p, 1),
            'disagree': round(disagree_p, 1),
        })

    return render(request, 'results.html', {
        'topic': topic,
        'results': processed,
        'statements': statements
    })


