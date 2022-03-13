from rest_framework import serializers

from settings.models import Device


class DeviceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Device
        fields = ('id', 'push_token', 'device_brand', 'manufacturer',
                  'model_name', 'model_id', 'os_name', 'os_version')