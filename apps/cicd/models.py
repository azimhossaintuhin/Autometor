from django.db import models
from apps.accounts.models import User


class Branch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    repo = models.CharField(max_length=2555)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# Create your models here.
class Workflow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    push_branch = models.ManyToManyField(Branch, related_name="push_workflow")
    pull_request_branch = models.ManyToManyField(
        Branch, related_name="pull_request_workflow"
    )
    repo = models.CharField(max_length=2555)
    framework = models.CharField(max_length=255)
