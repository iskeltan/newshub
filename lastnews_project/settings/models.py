from django.db import models

from core.models import BaseModel


class Device(BaseModel):
    push_token = models.CharField(max_length=100)
    device_brand = models.CharField(max_length=100, null=True, blank=True)
    manufacturer = models.CharField(max_length=100, null=True, blank=True)
    model_name = models.CharField(max_length=100, null=True, blank=True)
    model_id = models.CharField(max_length=100, null=True, blank=True)
    os_name = models.CharField(max_length=100, null=True, blank=True)
    os_version = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.push_token
