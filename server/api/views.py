# Create your views here.
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FileUploadParser

from .models import *
from .serializers import *

# Create your views here.
class ItemList(APIView):
    def get(self, request):
        items = Item.objects.all()
        serializers = ItemListSerializer(items, many=True)

        return Response(serializers.data)

class PointLatiLong(APIView):
    def get(self, request, city):
        point = Point.objects.filter(city=city).first()
        serializers = PointLatiLongSerializer(point)

        return Response(serializers.data)

class PointUfList(APIView):
    def get(self, request):
        points_uf = Point.objects.all()
        serializers = PointUfListSerializer(points_uf, many=True)

        return Response(serializers.data)

class PointCityList(APIView):
    def get(self, request, uf):
        points_city = Point.objects.filter(uf=uf)
        serializers = PointCityListSerializer(points_city, many=True)

        return Response(serializers.data)

class PointList(APIView):
    parser_class = (FileUploadParser,)
    
    def get(self, request):
        try:
            query = request.query_params
            items = query["items[]"].replace("[", "").replace("]", "").split(",")
            city = query["city"]
            uf = query["uf"]
            point = Point.objects.filter(items__id__in=items).filter(city=city).filter(uf=uf).distinct()
            serializer = PointSerializer(point, many=True)

            return Response(serializer.data)
        
        except:
            return Response([])

    def post(self, request):
        serializer = PointCreateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PointDetail(APIView):
    def get(self, request, pk):
        try:
            point = Point.objects.get(pk=pk)
            serializers = PointSerializer(point)
            return Response(serializers.data)
            
        except:
            return Response({ 'error': f"id: {pk} does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    