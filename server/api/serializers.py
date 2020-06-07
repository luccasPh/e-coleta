from rest_framework import serializers
from django.http.request import QueryDict
from .models import *

class ItemListSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        url = f"http://192.168.100.5:8000/static/{obj.image}/"
        return url

    class Meta:
        model = Item
        fields = ['id', 'title', 'image_url']

class PointCreateSerializer(serializers.ModelSerializer):
    items = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Item.objects.all()
    )

    def to_internal_value(self, data: QueryDict):
        value = str(data.get('items'))
        items_list = list(map(int, value.replace(" ", "").split(",")))
        data.setlist('items', items_list)

        values = super().to_internal_value(data)
        values['whatsapp'] = f"55{data['whatsapp']}"
        return values

    class Meta:
        model = Point
        fields = "__all__"

class PointSerializer(serializers.ModelSerializer):
    items = ItemListSerializer(many=True)

    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        url = f"http://192.168.100.5:8000/media/{obj.image}/"
        return url

    class Meta:
        model = Point
        fields = ['id', 'image_url', 'name', 'email', 'whatsapp', 'street', 'city', 'uf', 'latitude', 'longitude', 'items']

class PointUfListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Point
        fields = ['uf']

class PointCityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Point
        fields = ['city']

class PointLatiLongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Point
        fields = ['latitude', 'longitude']