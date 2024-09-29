from django.urls import path
from . import views

urlpatterns = [
    # events for calendar
    path('get_events_ym/',views.get_events_ym, name='get_events_ym'),
    path('get_events_m_count/',views.get_events_m_count, name='get_events_m_count'),
    path('get_events_all/',views.get_events_all, name='get_events_all'),
    path('get_events_upcoming/',views.get_events_upcoming, name='get_events_upcoming'),

    # event crud operations
    path('create_event/', views.create_event,name='create_events'),
    path('delete_event/',views.delete_event, name='delete_event'),
    path('delete_all_events/',views.delete_all_events, name='delete_all_events'),
    path('update_event/',views.update_event, name='update_event'), 
]