from rest_framework import serializers
from .models import *

class ItemListSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        url = f"http://localhost:8000/static/{obj.image}"
        return url

    class Meta:
        model = Item
        fields = ['id', 'title', 'image_url']

class PointCreateSerializer(serializers.ModelSerializer):
    items = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Item.objects.all()
    )
    class Meta:
        model = Point
        fields = ['id', 'image', 'name', 'email', 'whatsapp', 'city', 'uf', 'latitude', 'longitude', 'items']

class PointDetailSerializer(serializers.ModelSerializer):
    items = ItemListSerializer(many=True)
    class Meta:
        model = Point
        fields = ['id', 'image', 'name', 'email', 'whatsapp', 'city', 'uf', 'latitude', 'longitude', 'items']