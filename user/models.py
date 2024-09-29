from django.db import models

# Create your models here.
class UserData(models.Model):
    username=models.CharField(max_length=80, primary_key=True)
    fullname = models.CharField(max_length=180)
    email = models.CharField(max_length=300)

    def __str__(self):
        return self.username