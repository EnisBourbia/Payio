# Generated by Django 3.2.7 on 2021-11-17 00:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookkeep', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='businessevent',
            name='status',
            field=models.CharField(choices=[('Needs approval', 'Needs approval'), ('Done', 'Done')], default='Needs approval', max_length=15),
        ),
        migrations.AlterField(
            model_name='businessevent',
            name='file',
            field=models.FileField(upload_to=''),
        ),
    ]
