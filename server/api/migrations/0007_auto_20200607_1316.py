# Generated by Django 3.0.7 on 2020-06-07 13:16

import api.utils
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20200607_1250'),
    ]

    operations = [
        migrations.AlterField(
            model_name='point',
            name='image',
            field=models.FileField(upload_to=api.utils.upload_to),
        ),
    ]
