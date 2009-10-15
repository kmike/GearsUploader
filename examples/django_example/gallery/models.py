from django.db import models

class MyImage(models.Model):
    img = models.ImageField('image', upload_to='images')
