from django import forms
from .models import Topic
from .models import Statement 

class TopicForm(forms.ModelForm):
    class Meta:
        model = Topic
        fields = ['name', 'description']


class StatementForm(forms.ModelForm):
    class Meta:
        model = Statement
        fields = ['text']


class BulkStatementForm(forms.Form):
    raw_text = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 30, 'cols': 160}),
        label='Statements (eine pro Zeile)'
    )


class NameLoginForm(forms.Form):
    name = forms.CharField(label='Dein Name', max_length=100)
