# Generated by Django 3.1 on 2022-01-23 00:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('push_token', models.CharField(max_length=100)),
                ('device_brand', models.CharField(blank=True, max_length=100, null=True)),
                ('manufacturer', models.CharField(blank=True, max_length=100, null=True)),
                ('model_name', models.CharField(blank=True, max_length=100, null=True)),
                ('model_id', models.CharField(blank=True, max_length=100, null=True)),
                ('os_name', models.CharField(blank=True, max_length=100, null=True)),
                ('os_version', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
