from django.db import models
#from django.utils import timezone
#timezone.now

class Keys(models.Model):
	"""docstring for Keys"""

	key = models.CharField(max_length=10, verbose_name='key')
	tone = models.CharField(max_length=10, verbose_name='tone')
	keybordKey = models.CharField(max_length=10, verbose_name='keybordKey')
	defaultPitch = models.IntegerField(verbose_name='defaultPitch')
	position = models.CharField(max_length=10, verbose_name='position')
	positionPX = models.CharField(max_length=10, verbose_name='positionPX')


class Instruments(models.Model):
	"""docstring for Instruments"""

	name = models.CharField(max_length=20, verbose_name='name')
	var = models.CharField(max_length=20, verbose_name='var')
	file = models.CharField(max_length=20, verbose_name='file')


class Songs(models.Model):
	"""docstring for Songs"""

	name = models.CharField(max_length=10, verbose_name='name')


class Notes(models.Model):
	"""docstring for Notes"""

	idKey = models.ForeignKey(Keys, verbose_name='idKey', on_delete=models.CASCADE)
	idSong = models.ForeignKey(Songs, verbose_name='idSong', on_delete=models.CASCADE)
	pitch = models.IntegerField(verbose_name='pitch')
	duration = models.CharField(max_length=10, verbose_name='duration')
