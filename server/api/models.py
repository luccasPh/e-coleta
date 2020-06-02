from django.db import models

# Create your models here.
class Point(models.Model):
    image = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    whatsapp = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    uf = models.CharField(max_length=2)
    latitude = models.FloatField()
    longitude = models.FloatField()
    item = models.ManyToManyField("Item", related_name="point_items")

    def __str__(self):
        return self.name

class Item(models.Model):
    image = models.CharField(max_length=255)
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

