# Generated by Django 3.0.6 on 2020-06-03 23:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200602_2012'),
    ]

    operations = [
        migrations.RenameField(
            model_name='point',
            old_name='item',
            new_name='items',
        ),
    ]
