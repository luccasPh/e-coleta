# Create your views here.
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import *
from .serializers import *

# Create your views here.
class ItemList(APIView):
    def get(self, request):
        items = Item.objects.all()
        serializer = ItemListSerializer(items, many=True)

        return Response(serializer.data)

class PointList(APIView):
    def get(self, request):
        if request.query_params:
            query = request.query_params
            items = query["items"].replace(" ", "").split(",")
            city = query["city"]
            uf = query["uf"]
            point = Point.objects.filter(items__id__in=items).filter(city=city).filter(uf=uf).distinct()
            serializer = PointDetailSerializer(point, many=True)

            return Response(serializer.data)
        
        point = Point.objects.all()
        serializer = PointDetailSerializer(point, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PointCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("ok", status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PointDetail(APIView):
    def get(self, request, pk):
        try:
            point = Point.objects.get(pk=pk)
            serializers = PointDetailSerializer(point)
            return Response(serializers.data)
        except:
            return Response("fail", status=status.HTTP_400_BAD_REQUEST)
    