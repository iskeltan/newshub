from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from news.enums import NewsSource, NewsCategory

from settings.models import Device
from settings.serializers import DeviceSerializer


class SettingsViewSet(viewsets.ViewSet):
    throttle_classes = [AnonRateThrottle]

    def list(self, request, *args, **kwargs):
        sources = []
        for name, _source in NewsSource._member_map_.items():
            sources.append({
                "id": _source.value,
                "item": _source.label,
                "logo": "{}{}".format("https://056b-31-143-51-22.ngrok.io", _source.logo)
            })

        categories = []
        for name, category in NewsCategory._member_map_.items():
            categories.append({
                "id": category.value,
                "item": category.label
            })
        return Response({
            "sources": sources,
            "categories": categories
        })


class RegisterDeviceViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceSerializer
    queryset = Device.objects.all()
    throttle_classes = [AnonRateThrottle]

    # TODO: deactivate list method

    def create(self, request, *args, **kwargs):
        if self.queryset.filter(push_token=request.data["push_token"]):
            return Response(status=status.HTTP_200_OK)
        super().create(request, *args, **kwargs)
        return Response(status=status.HTTP_201_CREATED)