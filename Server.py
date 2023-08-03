from fastapi import FastAPI, Form, UploadFile, File, Query

#Import HTMLResponse to send out files properly
from fastapi.responses import HTMLResponse, FileResponse

import requests

#Import staticFiles to mount a file structure easily
from fastapi.staticfiles import StaticFiles

from pathlib import Path
from typing import Optional

#Import Json to handle json files
import json

#importing os to remove files if necessary
import os

#Import uvicorn to handle server
import uvicorn

infoPath = Path("./static/Json/config.Json")

with open(infoPath) as infoFile:
    info = json.load(infoFile)
    
    Host = info["Host"]
    Port = info["Port"]
    LogLevel = info["LogLevel"]
    
    ImageListUrl = info["ImageListUrl"]
    ImagesPerPage = info["PerPage"]
    
    ApiKey = info["ApiKey"]
    KeyHeader = {"Authorization": ApiKey}

    



#Creating the API for  the server to run
RESTapi = FastAPI()

RESTapi.mount("/static", StaticFiles(directory="./static"),name="static")

@RESTapi.get("/",response_class=HTMLResponse)
def getIndex():
    file = open("./static/html/Main.html","rb")
    return file.read()

@RESTapi.get("/GetImages/{type}")
def GetImages(type: str, query: Optional[str] = Query(None)):  
    url = ImageListUrl + type
    if query:
        url += f"?query={query}"
        url += f"&per_page={ImagesPerPage}"
    if not query:
        url += f"?per_page={ImagesPerPage}"
    
    print(url)
    
    try: 
        response = requests.get(url,headers= KeyHeader)
        if response.status_code == 200:
            data = response.json()
            print(data)
            return data
        else:
            print(f"Request failed with status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print("error")
        return {"error": str(e)}






uvicorn.run(RESTapi, host=Host, port=Port, log_level=LogLevel)