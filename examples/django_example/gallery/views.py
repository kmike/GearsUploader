from django.http import HttpResponseRedirect, HttpResponse
from django.views.generic.simple import direct_to_template
from django.views.generic.list_detail import object_list

from gallery.models import MyImage
from gallery.forms import MyImageForm, MyImageFormset


def upload_images(request):
    ''' Upload several images at once '''
    if request.method == 'POST':
        formset = MyImageFormset(request.POST, request.FILES,
                               queryset = MyImage.objects.none())
        if formset.is_valid():
            formset.save()
            return HttpResponseRedirect('/') # Redirect after POST
    else:
        formset = MyImageFormset(queryset = MyImage.objects.none())

    return direct_to_template(request, 'gallery/upload_images.html', {'formset': formset})


def upload_one_image(request):
    ''' Upload one image '''
    if request.method == 'POST':
        form = MyImageForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/') # Redirect after POST
    else:
        form = MyImageForm()
    return direct_to_template(request, 'gallery/upload_one_image.html', {'form': form})


def view_images(request):
    images = MyImage.objects.all().order_by('-pk')
    return object_list(request, images)