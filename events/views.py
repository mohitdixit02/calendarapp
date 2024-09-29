from .models import Event
from user.models import UserData
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
import json
from user.serializers import UserSerializer
from .serializers import EventSerializer
from datetime import datetime
from django.utils import timezone
from datetime import timedelta
import time

@api_view(['POST'])
def get_events_ym(request):
    user = request.user

    if not user.is_authenticated:
        return Response({
            'status': 'error',
            'message': 'User not authenticated'
        })

    data = request.data
    month = data['month']
    year = data['year']

    events = Event.objects.filter(user=user, start_time__month=month, start_time__year=year)
    events_data = EventSerializer(events, many=True).data
    return Response(events_data)

@api_view(['POST'])
def get_events_m_count(request):
    user = request.user

    if not user.is_authenticated:
        return Response({
            'status': 'error',
            'message': 'User not authenticated'
        })
    
    data = request.data
    year = data['year']

    events = Event.objects.filter(user=user, start_time__year=year)
    data = {}
    for event in events:
        month = event.start_time.month
        if month in data:
            data[month] += 1
        else:
            data[month] = 1
    
    return Response(data)

@api_view(['GET'])
def get_events_all(request):
    user = request.user

    if not user.is_authenticated:
        return Response({
            'status': 'error',
            'message': 'User not authenticated'
        })

    final_response = {}
    
    # All events
    events = Event.objects.filter(user=user).order_by('start_time')
    events_data = EventSerializer(events, many=True).data
    final_response['all'] = events_data

    year = datetime.now().year
    # Events of current year
    events = Event.objects.filter(user= user, start_time__year=year).order_by('start_time')
    events_data = EventSerializer(events, many=True).data
    final_response['this_year'] = events_data

    # Events of next year
    check_year = year + 1
    events = Event.objects.filter(user= user, start_time__year=check_year).order_by('start_time')
    events_data = EventSerializer(events, many=True).data
    final_response['next_year'] = events_data

    # Events of previous year
    prev_check_year = year - 1
    events = Event.objects.filter(user= user, start_time__year=2023).order_by('start_time')
    events_data = EventSerializer(events, many=True).data
    final_response['prev_year'] = events_data

    #this month
    month = datetime.now().month
    events = Event.objects.filter(user= user, start_time__year = year, start_time__month=month).order_by('start_time')
    events_data = EventSerializer(events, many=True).data
    final_response['this_month'] = events_data

    return Response(final_response)

@api_view(['GET'])
def get_events_upcoming(request):
    user = request.user

    if not user.is_authenticated:
        return Response({
            'status': 'error',
            'message': 'User not authenticated'
        })
    
    final_response = {}

    # today's date
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = datetime.now().replace(hour=23, minute=59, second=59, microsecond=999999)
    Events = Event.objects.filter(user=user, start_time__gte = today_start, end_time__lte = today_end).order_by('start_time')
    Events_data = EventSerializer(Events, many=True).data
    final_response['today'] = Events_data

    # tomorrow's date
    tomorrow_start = today_start + timedelta(days=1)
    tomorrow_end = today_end + timedelta(days=1)
    Events = Event.objects.filter(user=user, start_time__gte = tomorrow_start, end_time__lte = tomorrow_end).order_by('start_time')
    Events_data = EventSerializer(Events, many=True).data
    final_response['tomorrow'] = Events_data

    # Next 7 Days
    week_start = today_start + timedelta(days=1)
    week_end = today_end + timedelta(days=7)
    Events = Event.objects.filter(user=user, start_time__gte = week_start, end_time__lte = week_end).order_by('start_time')
    Events_data = EventSerializer(Events, many=True).data
    final_response['week'] = Events_data

    # Next 30 Days
    month_start = today_start + timedelta(days=1)
    month_end = today_end + timedelta(days=30)
    Events = Event.objects.filter(user=user, start_time__gte = month_start, end_time__lte = month_end).order_by('start_time')
    Events_data = EventSerializer(Events, many=True).data
    final_response['month'] = Events_data

    return Response(final_response)


# CRUD OPERATIONS FUNCTIONS
@api_view(['POST'])
def create_event(request):
    data = request.data
    date = data['date']
    title = data['title']
    description = data['description']
    start_time = data['start_time']
    end_time = data['end_time']

    request_user = request.user

    if request_user.is_anonymous:
        return Response({
            'status': 'error',
            'message': 'User not authenticated'
        })

    start_date_time_object = datetime.strptime(date + ' ' + start_time, '%Y-%m-%d %I:%M %p')
    end_date_time_object = datetime.strptime(date + ' ' + end_time, '%Y-%m-%d %I:%M %p')

    # conversion to timezone aware datetime object
    start_time_obj = timezone.make_aware(start_date_time_object, timezone.get_current_timezone())
    end_time_obj = timezone.make_aware(end_date_time_object, timezone.get_current_timezone())

    # creating a event
    try: 
        event = Event(user=request_user, title=title, description=description, start_time=start_time_obj, end_time=end_time_obj)
        event.save()
        return Response({
            'status': 'success',
            'message': 'Event created successfully'
        })
    except Exception as e:
        print(e)
        return Response({
                'status': 'error',
                'message':"Internal Server Error"
            })


@api_view(['POST'])
def delete_event(request):
    user = request.user

    if not user.is_authenticated:
        return Response({
            'status': 'error',
            'message': 'User not authenticated'
        })

    id = request.data
    event = Event.objects.get(user=user, id=id)
    event.delete()

    return Response({
        'status': 'success',
        'message': 'Event deleted successfully'
    })

@api_view(['POST'])
def delete_all_events(request):
    user = request.user

    if not user.is_authenticated:
        return Response({
            'status': 'error',
            'message': 'User not authenticated'
        })

    data = request.data
    id_collection = data['id_set']

    for i in id_collection:
        event = Event.objects.get(id=i)
        event.delete()

    return Response({
        'status': 'success',
        'message': 'All events deleted successfully'
    })

@api_view(['POST'])
def update_event(request):
    user = request.user

    if not user.is_authenticated:
        return Response({
            'status': 'error',
            'message': 'User not authenticated'
        })
    
    data = request.data
    date = data['date']
    title = data['title']
    description = data['description']
    start_time = data['start_time']
    end_time = data['end_time']

    start_date_time_object = datetime.strptime(date + ' ' + start_time, '%Y-%m-%d %I:%M %p')
    end_date_time_object = datetime.strptime(date + ' ' + end_time, '%Y-%m-%d %I:%M %p')

    # conversion to timezone aware datetime object
    start_time_obj = timezone.make_aware(start_date_time_object, timezone.get_current_timezone())
    end_time_obj = timezone.make_aware(end_date_time_object, timezone.get_current_timezone())

    event_id = data['event_id']

    event = Event.objects.get(user=user, id=event_id)
    event.title = title
    event.description = description
    event.start_time = start_time_obj
    event.end_time = end_time_obj
    event.save()
    
    return Response({
        'status': 'success',
        'message': 'Event updated successfully'
    })
