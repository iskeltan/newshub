from django.db import models
from django.dispatch import Signal

pre_bulk_update = Signal(providing_args=["queryset", "update_kwargs"])
post_bulk_update = Signal(providing_args=["update_kwargs", ])

pre_bulk_create = Signal(providing_args=["objs", "batch_size"])
post_bulk_create = Signal(providing_args=["objs", "batch_size"])


class CustomQuerySet(models.QuerySet):

    def update(self, **kwargs):
        pre_bulk_update.send(sender=self.model, queryset=self,
                             update_kwargs=kwargs)
        response = super(CustomQuerySet, self).update(**kwargs)
        post_bulk_update.send(sender=self.model, update_kwargs=kwargs)
        return response

    def bulk_create(self, objs, batch_size=None, ignore_conflicts=False):
        pre_bulk_create.send(sender=self.model, objs=objs,
                             batch_size=batch_size)
        response = super(CustomQuerySet, self).bulk_create(objs, batch_size)
        post_bulk_create.send(sender=self.model, objs=objs,
                              batch_size=batch_size)
        return response
