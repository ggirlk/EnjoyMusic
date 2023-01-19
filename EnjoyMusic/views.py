from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from EnjoyMusic.models import Keys
from EnjoyMusic.models import Songs
from EnjoyMusic.models import Instruments
from EnjoyMusic.models import Notes
import json

def index(request):
    context = {}
    #context['form'] = ClassifyForm()
    #return render(request, "index.html", context)
    return render(request, 'index.html')

def saveDefaultKeys():
    tones = {
        "0": ["c4", "C", "w", 19, "down", 0],
        "1": ["c_4", "C#", "a", 20, "top", 25], #
        "2": ["d4", "D", "x", 21, "down", 40],
        "3": ["d_4", "D#", "z", 22, "top", 65], #
        "4": ["e4", "E", "c", 23, "down", 80],
        "5": ["f4", "F", "q", 24, "down", 120],
        "6": ["f_4", "F#", "e", 25, "top", 145], #
        "7": ["g4", "G", "s", 26, "down", 160],
        "8": ["g_4", "G#", "r", 27, "top", 185], #
        "9": ["a4", "A", "d", 28, "down", 200],
        "10": ["a_4", "A#", "t", 29, "top", 225], #
        "11": ["b4", "B", "f", 30, "down", 240],
        "12": ["c5", "C+", "g", 31, "down", 280],
        "13": ["c_5", "C#+", "y", 32, "top", 305], #
        "14": ["d5", "D+", "h", 33, "down", 320],
        "15": ["d_5", "D#+", "u", 34, "top", 345], #
        "16": ["e5", "E+", "j", 35, "down", 360],
        "17": ["f5", "F+", "k", 36, "down", 400],
        "18": ["f_5", "F#+", "i", 37, "top", 425], #
        "19": ["g5", "G+", "l", 38, "down", 440],
        "20": ["g_5", "G#+", "o", 39, "top", 465], #
        "21": ["a5", "A+", "m", 40, "down", 480],
        "22": ["a_5", "A#+", "p", 41, "top", 505], #
        "23": ["b5", "B+", "b", 42, "down", 520],
        "24": ["c6", "C2+", "n", 43, "down", 560],
    }
    keys = {}
    for k, tone in zip(tones.keys(), tones.values()):
        ID = Keys(None, tone[0], tone[1], tone[2], tone[3], tone[4], tone[5])
        ID.save()
        keys[k] = ID
        print(ID)
    #return JsonResponse(keys)

def saveSong(request):
    """ """

    name = request.POST.get('name')
    Song = Songs(None, name)
    Song.save()
    postData = json.loads(request.POST.get('song'))
    idkeys = postData['idkeys']
    keys = postData['keys']
    tones = postData['tones']
    pitches = postData['pitches']
    durations = postData['durations']

    for idkey, tone, pitch, duration in zip(idkeys, tones, pitches, durations):
        idNotes = Notes(None, int(idkey), int(Song.id), int(pitch), duration)
        idNotes.save()

    return HttpResponse(Song.id)

def getKeys(request):
    """  """
    #saveDefaultKeys()
    keysDict = {}
    keysObject = Keys.objects.all()
    for key in keysObject:
        keysDict[key.id] = {"key": key.key,
                            "id": key.id,
                            "tone": key.tone,
                            "keybordKey": key.keybordKey,
                            "defaultPitch": key.defaultPitch,
                            "position": key.position,
                            "positionPX": key.positionPX,
                            }
    return JsonResponse(keysDict)

def getSongs(request):
    """  """
    songsDict = {}
    #Article.objects.select_related('reporter') 
    songsObject = Songs.objects.all()    
    keysObject = Keys.objects.all()
    

    for song in songsObject:
        songsDict[song.id] = {
                    "name": song.name,
                    "idkeys": [],
                    "keybordKeys": [],
                    "tones": [],
                    "idSong": song.id,
                    "pitches": [],
                    "durations":[] 
                    }
        notesObject = Notes.objects.filter(idSong=song.id)
        for notes in notesObject:
            songsDict[song.id]["idkeys"].append(notes.idKey.id)
            songsDict[song.id]["keybordKeys"].append(notes.idKey.keybordKey)
            songsDict[song.id]["tones"].append(notes.idKey.tone)
            songsDict[song.id]["pitches"].append(notes.pitch)
            songsDict[song.id]["durations"].append(int(notes.duration))

        #print(songsDict)
    return JsonResponse(songsDict)

def getInstruments(request):
    """  """
    instrumentsDict = {}
    instrumentsObject = Instruments.objects.all()
    for key in instrumentsObject:
        instrumentsDict[instrument.id] = {"var": instrument.var, "file": instrument.file}
    return JsonResponse(instrumentsDict)


