from django import forms

from gallery.models import MyImage
from django.forms.models import modelformset_factory

class MyImageForm(forms.ModelForm):
    class Meta:
        model = MyImage

MyImageFormset = modelformset_factory(MyImage, extra=3)
